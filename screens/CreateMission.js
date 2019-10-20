import React, { Component } from 'react';
import { TimePickerAndroid, DatePickerAndroid } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Picker, Icon, Toast } from 'native-base';
import * as firebase from 'firebase';

class CreateMission extends Component {
  static navigationOptions = {
    title: 'Create Mission',
  }

  constructor(props) {
    super(props);
    this.state = {
      mission: "",
      description: "",
      selected: undefined,
      time: "",
      date: "",
      doneInput: false
    }
    this.openTimePicker = this.openTimePicker.bind(this);
    this.openDatePicker = this.openDatePicker.bind(this);
  }

  onCoastalChange(value) {
    this.setState({
      selected: value,
    });
  }

  handleMission(mission) {
    this.setState({ mission })
  }

  handleDesc(description) {
    this.setState({ description })
  }

  handleSubmit = e => {
    e.preventDefault();

    const { mission, description, selected, date, time } = this.state;

    firebase.database().ref('missions/').push({
      mission,
      description,
      coastal_area: JSON.parse(selected),
      date: this.getYearWord(date.month) + " " + date.day + ", " + date.year,
      time: {
        hour: time.hour,
        minute: time.minute
      },
      status: 'approved'
    })

    alert("Mission Submitted.");
    this.props.navigation.navigate('Home');
  }

  async openTimePicker() {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: this.state.time.hour,
        minute: this.state.time.minute,
      })
      if (action !== TimePickerAndroid.dismissedAction) {
        let time = {
          hour,
          minute
        }
        this.setState({ time, doneInput: true })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  }

  async openDatePicker() {
    try {
      var today = new Date();
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(),
        mode: 'calendar'
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        // console.warn(`${this.getYearWord(month)} ${day}, ${year}`)
        let date = {
          month, day, year
        }
        this.setState({ date })
        this.openTimePicker();
      }
    } catch ({ code, message }) {
      alert('Cannot open date picker: ' + message);
    }
  }

  getYearWord(month) {
    const map = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]

    return map[month - 1]
  }

  getHourEquiv(hour) {
    const map = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ]

    if (hour == 0) {
      return map[11];
    }

    else if (hour >= 13) {
      return map[hour - 13]
    }

    return hour;
  }

  getAMPM(hour) {
    if (hour >= 12 && hour <= 23) {
      return "PM"
    }

    return "AM"
  }

  render() {
    const { hour, minute } = this.state.time;
    const { month, day, year } = this.state.date;

    return (
      <Container style={{
        flexDirection: "row",
        justifyContent: "center",
      }}>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Mission Name</Label>
              <Input onChangeText={this.handleMission.bind(this)} />
            </Item>
            <Item stackedLabel>
              <Label>Description</Label>
              <Input onChangeText={this.handleDesc.bind(this)} />
            </Item>
            <Item>
              <Item stackedLabel>
                <Label>Coastal Area</Label>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: 350, alignSelf: "center" }}
                  placeholder="Select Coast"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.selected}
                  onValueChange={this.onCoastalChange.bind(this)}
                >
                  <Picker.Item label="Please Select..." value="0" />
                  <Picker.Item label="Times Beach, Davao City" value={'{ \"latitude\": 7.043948, \"longitude\": 125.5909838, \"name\": \"Times Beach, Davao City\" }'} />
                  <Picker.Item label="Lanang Aplaya Resort, Davao City" value={'{ \"latitude\": 7.1033498, \"longitude\": 125.649821, \"name\": \"Lanang Aplaya Resort, Davao City\" }'} />


                </Picker>
              </Item>
            </Item>
            <Item stackedLabel>
              <Label>Schedule</Label>
              <Button onPress={this.openDatePicker} transparent>
                <Text>{!this.state.doneInput ? "Select Date & Time" : `${this.getYearWord(month)} ${day}, ${year} | ${this.getHourEquiv(hour)}:${minute < 10 ? `0${minute}` : minute} ${this.getAMPM(hour)}`}</Text>
              </Button>
            </Item>
            <Button onPress={this.handleSubmit} block style={{
              alignSelf: "center",
              width: 350,
              marginTop: 20
            }}>
              <Text>Submit</Text>
            </Button>
          </Form>
        </Content>
      </Container >
    )
  }
}

export default CreateMission;