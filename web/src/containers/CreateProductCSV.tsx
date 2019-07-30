import './CreateProductCSV.scss';
import React, { Component } from 'react';
import XLSX from 'xlsx';
import DragDropFile from '../components/DragDropFile';
import DataInput from '../components/InputFile';
import ColumnSelector from './ColumnSelector';
import { withRouter, RouteComponentProps } from 'react-router';
import CreateProductTable from './CreateProductTable';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

interface State {
  workBook: ColumnSelector['props']['workBook'];
  sheetNames: ColumnSelector['props']['sheetNames'];
  data?: string[][]; // TODO: CreateProductTable['props']['data']
}

function makeCols(refstr: string) {
  const cols = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;

  for (let i = 0; i < C; ++i) {
    cols[i] = XLSX.utils.encode_col(i);
  }

  return cols;
};

class CreateProductCSV extends Component<RouteComponentProps & AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      workBook: {},
      sheetNames: []
    };
  }

  handleFile(file: File) {
    /* Boilerplate to set up FileReader */
    const fileReader = new FileReader();
    const rABS = !!fileReader.readAsBinaryString;

    fileReader.onload = (event) => {
      /* Parse data */
      const bstr = (event.target! as any).result;
      const readBook = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});

      const workBook: State['workBook'] = {};

      readBook.SheetNames.forEach((sheetName) => {
        const worksheet = readBook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
          raw: false,
          blankrows: false,
        });

        const cols = makeCols(worksheet['!ref']!);

        workBook[sheetName] = { data, cols };
      });

      this.setState({
        workBook,
        sheetNames: readBook.SheetNames,
        data: undefined
      });
    };

    if (rABS) {
      fileReader.readAsBinaryString(file);
    } else {
      fileReader.readAsArrayBuffer(file);
    }
  }

  // exportFile() {
  //   // Convert state to workbook
  //   const ws = XLSX.utils.aoa_to_sheet(this.state.data);
  //   const wb = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  //   // Generate XLSX file and send to client
  //   XLSX.writeFile(wb, 'data.xlsx')
  // }

  render() {
    const {
      workBook,
      sheetNames,
      data
    } = this.state;

    return <div className='CreateProductCSV container'>
      <h3>Carga de productos</h3>
      <p>
        Sube un archivo de Excel o CSV para cargar los productos que ya tengas en él.
      </p>

      <DragDropFile handleFile={this.handleFile.bind(this)}>
        <div>
          Arrastra un archivo de Excel aquí<br/>
          o cárgalo en el botón
          <DataInput handleFile={this.handleFile.bind(this)} />
        </div>
      </DragDropFile>

      <br/>

      {
        !data
          ? <ColumnSelector
              workBook={workBook}
              sheetNames={sheetNames}
              fields={['sku', 'description']}
              nextStep={(data) => {
                this.setState({
                  data
                });
              }}
            />
          : <CreateProductTable data={data} auth={this.props.auth}/>
      }
    </div>;
  }

}

export default withAuthInfo(withRouter(CreateProductCSV));
