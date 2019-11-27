import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ShimmerAvatar,
  ShimmerText,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    loadingData: [],
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const fakeData = [];

    for (let i = 0; i < 10; i++) {
      fakeData.push({
        id: String(i),
        owner: {
          avatar_url: 'loading',
          login: 'loading',
        },
        name: 'loading',
      });
    }

    this.setState({ loading: true, loadingData: fakeData });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { stars, page } = this.state;
    const nexPage = page + 1;

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: nexPage,
      },
    });

    this.setState({ stars: [...stars, ...response.data], page: nexPage });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ refreshing: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, page: 1, refreshing: false });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('WebPage', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing, loadingData } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={loading ? loadingData : stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          onEndReached={this.loadMore}
          scrollEnabled={!loading}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              <>
                <ShimmerAvatar autoRun visible={!loading}>
                  {item.owner && (
                    <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  )}
                </ShimmerAvatar>

                <Info>
                  <ShimmerText autoRun visible={!loading}>
                    <Title>{item.name}</Title>
                  </ShimmerText>
                  <ShimmerText autoRun visible={!loading}>
                    {item.owner && <Author>{item.owner.login}</Author>}
                  </ShimmerText>
                </Info>
              </>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
