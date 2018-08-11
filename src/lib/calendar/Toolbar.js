import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'

import { capitalize } from './utils/formater'

const styles = theme => ({
  root: {
    height: 64,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  navigationBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  toolbarItem: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  iconButton: {
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5
  },
  button: {
    backgroundColor: '#f5f5f5',
    color: theme.palette.grey[500],
    textAlign: 'center',
    fontSize: 14
  },
  capitalize: {
    textTransform: 'capitalize'
  }
})

const options = [
  'day',
  'month',
  'week'
]

class Toolbar extends Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null,
      mode: 'month'
    }
  }

  handleToggleleftToolBar = (e) => {
    if (this.props.onToggleLeftToolBar) {
      this.props.onToggleLeftToolBar(e)
    }
  }

  handleTodayClick = e => {
    e.preventDefault()
    this.props.onClickToday(e)
  }

  handlePreviousClick = e => {
    e.preventDefault()
    this.props.onClickPrevious(e, this.props.mode)
  }

  handleNextClick = e => {
    e.preventDefault()
    this.props.onClickNext(e, this.props.mode)
  }

  handleMenuClick = e => {
    this.setState({ anchorEl: e.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    })
  }

  handleMenuItemClick = (e, option) => {
    this.setState({
      anchorEl: null,
      mode: option
    })
    if (this.props.onModeChange) {
      this.props.onModeChange(e, option)
    }
  }

  render () {
    const {
            classes,
            month,
            mode
          } = this.props

    const { anchorEl } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.navigationBar}>

          <div className={classes.toolbarItem}>
            <IconButton
              onClick={this.handleToggleleftToolBar}
              color='inherit'
              aria-label='Menu'
            >
              <MenuIcon />
            </IconButton>
          </div>

          <div className={classes.toolbarItem}>
            <Button
              className={cn(classes.button, classes.capitalize)}
              onClick={this.handleTodayClick}
            >
              <Typography variant='body1'>
                Today
              </Typography>
            </Button>
          </div>
          <div className={classes.toolbarItem}>

            <IconButton
              className={classes.iconButton}
              onClick={this.handlePreviousClick}
              aria-label='previous day'
            >
              <KeyboardArrowLeft />
            </IconButton>

            <IconButton
              className={classes.iconButton}
              onClick={this.handleNextClick}
              aria-label='next day'
            >
              <KeyboardArrowRight />
            </IconButton>
          </div>

          <div className={classes.toolbarItem}>
            <Typography variant='subheading'>
              {moment(month).format('MMMM YYYY')}
            </Typography>
          </div>
        </div>
        <div>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup='true'
            onClick={this.handleMenuClick}
            className={cn(classes.button, classes.capitalize)}
          >
            <Typography variant='body1'>
              {capitalize(mode)}
            </Typography>
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                onClick={(e) => this.handleMenuItemClick(e, option)}
              >
                <Typography variant='body1'>
                  {capitalize(option)}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    )
  }
}

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  month: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onToggleLeftToolBar: PropTypes.func.isRequired,
  onClickToday: PropTypes.func.isRequired,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired
}

export default withStyles(styles)(Toolbar)
