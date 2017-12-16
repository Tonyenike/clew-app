import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react';

export default class SelectableCard extends Component {

  render() {
    const { title, selected, onSelected } = this.props;

    if (selected) {
      return (
        <Card onClick={() => onSelected(title)}
          color="green">
          <Card.Content>
            <Card.Header>
              {title}
              <Icon name="check circle"
                className="right floated"
                color="green" />
            </Card.Header>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card onClick={() => onSelected(title)}>
          <Card.Content>
            <Card.Header>
              {title}
            </Card.Header>
          </Card.Content>
        </Card>
      );
    }
  }
}
