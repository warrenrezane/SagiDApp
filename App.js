import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home'
import CreateMission from './screens/CreateMission'

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    CreateMission: {
      screen: CreateMission
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const AppContainer = createAppContainer(RootStack)

export default AppContainer;