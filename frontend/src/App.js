import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Header from './components/Header/Header';
import BlogListing from './components/BlogListing/BlogListing';
import SingleBlogPost from './components/SingleBlogPost/SingleBlogPost';
import StatusMessage from './components/StatusMessage/StatusMessage';

const StyledApp = styled.div`
  text-align: center;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: [],
      showList: true,
      currentPost: {},
      isError: false,
      statusMessage: '',
    }
    this.showPost = this.showPost.bind(this);
    this.returnToList = this.returnToList.bind(this);
  }

  showPost(post) {
    this.setState({
      showList: false,
      currentPost: post,
    });
  }

  returnToList(e) {
    this.setState({
      showList: true,
      currentPost: {},
    })
  }

  componentDidMount() {
    axios.get(`http://cms.decoupled.lndo.site/jsonapi/node/article?include=field_tags,field_image`)
      .then(res => {
        const blogPosts = res.data;
        this.setState({blogPosts: blogPosts});
      })
      .catch((error) => {
        this.setState({
          isError: true,
          statusMessage: error.message,
        })
        console.log(error);
      });
  }

  render() {
    return (
      <StyledApp>
        <Header />
        {this.state.isError &&
          <StatusMessage message={this.state.statusMessage} type={'Error'} />
        }
        {(this.state.showList === true && this.state.blogPosts.data) &&
          <Fragment>
            <h2>Blog Listing</h2>
            <BlogListing 
              blogPosts={this.state.blogPosts.data}
              includes={this.state.blogPosts.included}
              showPost={this.showPost}
            />
          </Fragment> 
        }
        {(this.state.showList !== true && this.state.blogPosts.data) &&
          <SingleBlogPost 
            postDetails={this.state.currentPost}
            returnToList={this.returnToList}
          />
        }
      </StyledApp>
    );
  }
}

export default App;
