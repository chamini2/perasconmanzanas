import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import isNull from 'lodash/isNull';
import Badge from 'react-bootstrap/Badge';
import isUndefined from 'lodash/isUndefined';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

interface State {
  selected: string | null;
  data: string[][];
  cols: string[];
  fieldColumnMap: {
    [field: string]: {
      name: string;
      index: number;
    };
  };
  fieldToSet: string | null;
}

interface Props {
  sheetNames: string[];
  workBook: {
    [sheetName: string]: {
      cols: string[];
      data: string[][];
    }
  };
  fields: {field: string, name: string, optional?: boolean}[];
  nextStep: (data: State['data']) => void;
}

class ColumnSelector extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: null,
      data: [],
      cols: [],
      fieldColumnMap: {},
      fieldToSet: null
    };
  }

  componentDidUpdate(prevProps: ColumnSelector['props'], prevState: ColumnSelector['state']) {
    const {
      selected
    } = this.state;

    const {
      sheetNames,
      fields
    } = this.props;

    let fieldToSet = null;
    if (fields.length > 0) {
      fieldToSet = fields[0].field;
    }

    if (!isEqual(prevProps, this.props)) {

      this.setState({
        selected: sheetNames.length > 0 ? sheetNames[0] : null,
        data: [],
        cols: [],
        fieldColumnMap: {},
        fieldToSet
      });

    } else if (prevState.selected !== selected) {

      if (isNull(selected) && this.props.sheetNames.length > 0) {
        this.setState({
          selected: this.props.sheetNames[0]
        });
      } else {
        const worksheet = this.props.workBook[selected!];
        this.setState({
          data: worksheet.data,
          cols: worksheet.cols,
          fieldColumnMap: {},
          fieldToSet
        });
      }

    }
  }

  validateForm() {
    const {
      fieldColumnMap
    } = this.state;

    const {
      fields
    } = this.props;

    return every(fields, (field) => field.optional || !isUndefined(fieldColumnMap[field.field]));
  }

  nextStep(event: React.MouseEvent) {
    event.stopPropagation();

    const {
      data,
      fieldColumnMap,
    } = this.state;

    const {
      fields
    } = this.props;

    const filteredData = data.map((row) =>
      fields.map((field) => row[fieldColumnMap[field.field].index])
    );

    this.props.nextStep(filteredData);
  }

  renderColumn(name: string, index: number) {
    const {
      fieldToSet
    } = this.state;

    const {
      fields
    } = this.props;

    return <th
      onClick={(event) => {
        event.stopPropagation();

        if (!isNull(fieldToSet)) {
          const fieldIndex = fields.findIndex((field) => field.field === fieldToSet);
          if (fieldIndex != -1) {

          }

          this.setState({
            fieldColumnMap: {
              ...this.state.fieldColumnMap,
              [fieldToSet]: { name, index }
            },
            fieldToSet: isUndefined(fields[fieldIndex + 1]) ? null : fields[fieldIndex + 1].field
          });
        }
      }}
      key={index}
    >
      {name}
    </th>;
  }

  render() {
    const {
      data,
      cols,
      selected,
      fieldToSet,
      fieldColumnMap
    } = this.state;

    const {
      sheetNames,
      fields
    } = this.props;

    if (sheetNames.length === 0) {
      return null;
    }

    if (fields.length === 0) {
      return <div className="ColumnSelector container">
        <h3>ERROR: No fields to select</h3>
      </div>
    }

    return <div className="ColumnSelector container">
      <h5>Elige una columna para:</h5>
      <ListGroup>
        {fields.map((field) =>
          <ListGroup.Item
            active={fieldToSet === field.field}
            key={field.field}
            onClick={(event: any) => {
              event.stopPropagation();

              this.setState({
                fieldToSet: field.field
              });
            }}
          >
            {field.name}
            <Badge style={{marginLeft: '1em'}}>{field.optional ? 'Opcional' : null}</Badge>
            {
              fieldColumnMap[field.field]
                ? <>
                    <Badge
                      style={{ marginLeft: '1em' }}
                    >
                      {selected} - {fieldColumnMap[field.field].name}
                    </Badge>
                    <Button
                      style={{marginLeft: '2em'}}
                      size='sm'
                      variant='outline-secondary'
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();

                        const {
                          fieldColumnMap
                        } = this.state;

                        delete fieldColumnMap[field.field];

                        this.setState({
                          fieldColumnMap
                        });
                      }}
                    >
                      Deshacer
                    </Button>
                  </>
                : null
            }
          </ListGroup.Item>
        )}
      </ListGroup>

      <br/>

      <div>
        <Button onClick={this.nextStep.bind(this)} disabled={!this.validateForm()}>
          Continuar
        </Button>
        <br/>
        Podrás revisar los datos en el siguiente paso
      </div>

      <br/>
      <br/>

      <Nav as='ul' variant='tabs'>
        {sheetNames.map((name) =>
          <Nav.Item as='li' key={name}>
            <Nav.Link
              active={selected === name}
              onClick={(event: any) => {
                event.stopPropagation();

                this.setState({
                  selected: name
                });
              }}
            >
              {name}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      <Table variant='responsive'>
        <thead>
          <tr>
            {cols.map(this.renderColumn.bind(this))}
          </tr>
        </thead>
        <tbody>
          {
            data.map((row, i) =>
              <tr key={i}>
                {cols.map((_col, i) => <td key={i}>{row[i]}</td>)}
              </tr>
            )
          }
        </tbody>
      </Table>
    </div>;
  }

}

export default ColumnSelector;
