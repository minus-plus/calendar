import amber from '@material-ui/core/colors/amber'
import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import blueGrey from '@material-ui/core/colors/blueGrey'
import orange from '@material-ui/core/colors/orange'
import deepOrange from '@material-ui/core/colors/deepOrange'
import purple from '@material-ui/core/colors/purple'
import deepPurple from '@material-ui/core/colors/deepPurple'
import lightGreen from '@material-ui/core/colors/lightGreen'
import green from '@material-ui/core/colors/green'
import pink from '@material-ui/core/colors/pink'

const palette = [
  amber,
  blueGrey,
  deepOrange,
]

const colors = palette.map(c => c[700])

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pickColors = () => {
  return shuffle(colors).slice(0, 3)
}

const pickedColors = ['#ffa64d', '#4d4d4d', '#8c8c8c']
//const pickedColors = ['#F27043', '#63C799', '#28A9E8']

export default pickedColors