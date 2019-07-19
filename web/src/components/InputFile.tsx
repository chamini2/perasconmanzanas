import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import InputGroup from 'react-bootstrap/InputGroup';

const SUPPORTED_FILETYPES = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
];

const ACCEPT_FILETYPES_STRING = SUPPORTED_FILETYPES.map(function(x) { return "." + x; }).join(",");

interface Props {
  handleFile: (file: File) => void;
  label?: string;
}

class InputFile extends Component<Props> {

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      this.props.handleFile(files[0]);
    }
  }

  render() {
    return <Form className="InputFile">
      <InputGroup>
        {
          this.props.label
            ? <FormLabel htmlFor="file">{this.props.label}</FormLabel>
            : null
        }
        <input
          type="file"
          id="file"
          accept={ACCEPT_FILETYPES_STRING}
          onChange={this.handleChange.bind(this)}
        />
      </InputGroup>
    </Form>;
  }

}

export default InputFile;
