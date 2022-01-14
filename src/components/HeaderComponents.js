import React from 'react';
import { Appbar } from 'react-native-paper';
import { useLocation } from 'react-router-dom';

const HeaderComponents = ({ onPressDots }) => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/detail' && location.pathname !== '/' &&
        <Appbar.Header>
          <Appbar.BackAction />
          <Appbar.Content title="Nonabel Apps" subtitle="Job List" />
          <Appbar.Action icon="dots-vertical" onPress={onPressDots} />
        </Appbar.Header>
      }
    </>
  )
}

export default HeaderComponents;