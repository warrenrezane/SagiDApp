import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
import { Container, View, Button, Icon, Fab } from 'native-base';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { AppLoading } from 'expo';
import * as firebase from 'firebase';
import firebaseConfig from '../firebase-config';

firebase.initializeApp(firebaseConfig);

class Home extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);
		this.state = {
			region: {
				latitude: 0,
				longitude: 0,
				latitudeDelta: 0,
				longitudeDelta: 0
			},
			active: false,
			isReady: false,
			approvedMissions: [],
			markers: [],
			mapReady: false
		}
		this.mapReadyClick = this.mapReadyClick.bind(this);
	}


	componentWillMount() {
		this.getLocationAsync();
		this.getApprovedMissions();
	}

	getApprovedMissions() {
		let missionArr = [];
		let coordinate = [];

		firebase.database().ref('missions/').on('value', function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				let childData = childSnapshot.val();
				// console.warn(JSON.stringify(childData))
				// console.warn(childData.status)
				if (childData.status == "approved") {
					missionArr.push(childData);
					let pos = {
						latitude: childData.coastal_area.latitude,
						longitude: childData.coastal_area.longitude,
					}
					coordinate.push(pos)
				}
			})
		})

		this.setState({ approvedMissions: missionArr, markers: coordinate })
	}

	mapReadyClick() {
		this.setState({
			mapReady: true
		})
	}

	getLocationAsync = async () => {
		await Font.loadAsync({
			Roboto: require('../node_modules/native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		});
		this.setState({ isReady: true })

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
		if (!this.state.isReady) {
			return <AppLoading />;
		}

		setTimeout(this.mapReadyClick, 1000);

		return (
			<Container>
				<MapView
					ref={ref => { this.mapView = ref }}
					style={styles.mapStyle}
					provider={PROVIDER_GOOGLE}
					showsUserLocation
					followsUserLocation
					initialRegion={this.state.region}
				>
					{
						this.state.approvedMissions.map((mission, index) => (
							// console.warn(mission.coastal_area)
							<Marker key={index}
								coordinate={{
									latitude: mission.coastal_area.latitude,
									longitude: mission.coastal_area.longitude
								}}
								title={mission.mission}
								description={mission.description}
							/>
						))
					}
				</MapView>
				<View>
					<Fab
						active={this.state.active}
						direction="up"
						containerStyle={{}}
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
