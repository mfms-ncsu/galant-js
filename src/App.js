import './App.css';
import React , {Component} from 'react'

class App extends Component {

  graph_data = ''

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      this.graph_data = (e.target.result)
    };
    reader.readAsText(e.target.files[0])
    
  }
  
  render = () => {
    return (
      <div className="App">
        <p>Galant<br/></p>
        <input type='file' onChange={(e) => this.showFile(e)} />
        <textarea disabled></textarea>
      </div>
    );
  }
}

export default App;