import React, { Component } from "react";
import { TextInput } from "react-native";

class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numericString: this.props.value.toString()
    };
  }

  onChangeInput = text => {
    this.setState({ numericString: text });
    if (!isNaN(text)) {
      this.props.onChange(Number(text));
    }
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this.textRef);
  }
  componentWillUnmount() {
    if (this.props.onRef) this.props.onRef(undefined);
  }

  render() {
    return (
      <TextInput
        ref={textRef => {
          this.textRef = textRef;
        }}
        keyboardType="numeric"
        value={this.state.numericString}
        style={this.props.style}
        onChangeText={this.onChangeInput}
      />
    );
  }
}

export default NumberInput;
