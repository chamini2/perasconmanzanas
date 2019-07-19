import React, { Component } from 'react';

interface Props {
  handleFile: (file: File) => void;
}

interface State {
  dragging: boolean;
}

class DragDropFile extends Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      dragging: false
    };
  }

  isDragging(val: boolean) {
    return (event?: React.DragEvent) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      this.setState({
        dragging: val
      });
    };
  }

  onDrop(event: React.DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files && files[0]) {
      this.props.handleFile(files[0]);
    }
  }

  render() {
    return <div
      onDrop={(event) => {
        this.onDrop(event);
        this.isDragging(false)();
      }}
      onDragEnter={this.isDragging(true)}
      onDragOver={this.isDragging(true)}
      onDragExit={this.isDragging(false)}
      className={'DragDropFile' + (this.state.dragging ? ' dragging': '')}
    >
      {this.props.children}
    </div>;
  }

}

export default DragDropFile;
