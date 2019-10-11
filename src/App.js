import React from 'react';
import MovieGroup from './component/MovieGroup';
import './App.css';

const apiUrl = 'https://cdn-discover.hooq.tv/v1.2/discover/feed?region=ID&page=[page]&perPage=20';
const groupType = 'Multi-Title-Manual-Curation';
const imageType = 'POSTER';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      paegLoading: false,
      movieGroups: []
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    console.log('componentDidMount page: ' + this.state.page);
    this.retrieveData();
    // this.setState({ page: 1 });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const sameLength = this.state.movieGroups.length === nextState.movieGroups.length;
  //   const samePage = this.state.page === nextState.page; 
  //   console.log(`${this.state.movieGroups.length} vs ${nextState.movieGroups.length}`);

  //   if (samePage) return false;
  //   return false;
  // }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate page: ' + this.state.page);
    if (this.state.page !== prevState.page) {
      this.retrieveData();
    }
  }

  handleScroll = (event) => {
    // debugger;
    // document.documentElement.scrollHeight
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const percent = scrollTop / scrollHeight;
    console.log(`scrollHeight: ${scrollHeight}, scrollTop: ${scrollTop}, percent: ${percent}`);
    if (percent > 0.8) {
      console.log('go load new page');
      // this.setState((state) => {
      //   return { page: state.page + 1 };
      // });
      this.retrieveData();
    }
  }

  retrieveData = () => {
    fetch(apiUrl.replace('[page]', this.state.page + 1), { method: 'GET' })
    .then((response) => {
      return response.json();
    })
    .then((feed) => {
      this.extractFeed(feed);
    })
    .catch((error) => {
      console.log('Request failed', error);
    });
  }

  extractFeed = (feed) => {
    const groups = feed.data;
    const multiTitleGroups = groups.filter(group => group.type === groupType);
    const movieGroups = multiTitleGroups.map(group => {
      const groupName = group.row_name;
      const movies = group.data.map(movie => {
        const poster = movie.images.filter(image => image.type === imageType)[0];
        const posterUrl = poster ? poster.url : ''; 
        return {
          title: movie.title,
          image: posterUrl, 
        }
      });
      return { groupName, movies }
    })
    const newMovieGroup = [ ...this.state.movieGroups, ...movieGroups ];
    this.setState({ movieGroups: newMovieGroup });
  }

  render() {
    return (
      <div style={style.container} onScroll={this.handleScroll}>
        {this.state.movieGroups.map((movieGroup, index) => {
          return (
            <MovieGroup key={index} movieGroup={movieGroup} />
          );
        })}
      </div>
    );
  }
}

const style = {
  container: {
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    padding: '20px',
  }
}

export default App;
