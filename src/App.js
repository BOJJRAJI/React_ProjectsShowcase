import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const initialApiStatus = {
  initial: 'Initial',
  success: 'Success',
  failure: 'Failure',
  inProgress: 'InProgress',
}

class App extends Component {
  state = {
    projectsList: [],
    apiStatus: initialApiStatus.inProgress,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {category} = this.state
    this.setState({apiStatus: initialApiStatus.inProgress})
    const options = {method: 'GET'}
    const responce = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${category}`,
      options,
    )
    const data = await responce.json()
    if (responce.ok) {
      console.log(data)

      this.setState({
        apiStatus: initialApiStatus.success,
        projectsList: data.projects,
      })
    } else {
      this.setState({apiStatus: initialApiStatus.failure})
    }
  }

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApiStatus.success:
        return this.renderSuccess()
      case initialApiStatus.inProgress:
        return this.renderLoader()
      case initialApiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderSuccess = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-container">
        {projectsList.map(item => (
          <li className="list-item" key={item.id}>
            <img src={item.image_url} alt={item.name} className="lits-image" />
            <p className="list-name">{item.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="failure-container" data-testid="loader">
      <Loader type="threeDots" color="#328af2" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt=" failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        we cannot seem to find the page you are looking for
      </p>
      <button className="retry-button" type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <div className="bg-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-image"
          />
        </div>
        <div className="select-container">
          <select
            className="select-element"
            onChange={e =>
              this.setState({category: e.target.value}, this.getProjects)
            }
          >
            {categoriesList.map(item => (
              <option key={item.id} value={item.id}>
                {item.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderViews()}
      </div>
    )
  }
}

export default App
