import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
import { Container, View, Button, Icon, Fab } from 'native-base';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class Home extends Component {
	static navigationOptions = {
		header: null
	}

	state = {
		region: {
			latitude: 0,
			longitude: 0,
			latitudeDelta: 0,
			longitudeDelta: 0
		},
		active: false
	}

	componentWillMount() {
		this.getLocationAsync();
	}

	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			alert("Location access was denied.");
		}

		let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1 });
		const region = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			latitudeDelta: 0.04,
			longitudeDelta: 0.06
		}
		
		this.mapView.animateToRegion(region, 1000);
	}

	goToCreateMission() {
		this.setState({ active: !this.state.active });
		this.props.navigation.navigate('CreateMission');
	}

	render() {
		return (
			<Container>
				<MapView 
					ref={ref => {this.mapView = ref}}
					style={styles.mapStyle}
					provider={PROVIDER_GOOGLE}
					showsUserLocation
					followsUserLocation
					initialRegion={this.state.region}
				/>
				<View>
					<Fab
						active={this.state.active}
						direction="up"
						containerStyle={{ }}
						style={{ backgroundColor: '#5067FF' }}
						position="bottomRight"
						onPress={() => this.setState({ active: !this.state.active })}>
						<Icon name="menu" />
						<Button style={{ backgroundColor: '#34A34F' }} onPress={this.goToCreateMission.bind(this)}>
							<Icon name="add" />
						</Button>
					</Fab>
				</View>
			</Container>
		);
	}
}

export default Home;

const styles = StyleSheet.create({
	mapStyle: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	}
});
  