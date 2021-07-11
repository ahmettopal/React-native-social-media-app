import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Transition, Transitioning } from 'react-native-reanimated';

import Images from '../../res/images'

const bgColors = {
    anasayfa: '#cfd6fa',
    keşfet: '#cfd6fa',
    paylaş: '#cfd6fa',
    profil: '#cfd6fa',
};

const textColors = {
    anasayfa: '#000',
    keşfet: '#000',
    paylaş: '#000',
    profil: '#000',
};

const Container = styled.TouchableWithoutFeedback``;

const Background = styled(Transitioning.View)`
  flex: auto;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.focused ? bgColors[props.label] : 'white')};
  border-radius: 100px;
  margin: 6px;
`;
const Icon = styled.Image`
  height: 24px;
  width: 24px;
`;

const Label = styled.Text`
  color: ${(props) => textColors[props.label]};
  font-weight: 600;
  margin-left: 8px;
`;

function Tab({ label, accessibilityState, onPress }) {
    const focused = accessibilityState.selected;
    const icon = !focused ? Images[label] : Images[`${label}Focused`];

    const transition = (
        <Transition.Sequence>
            <Transition.Out type="fade" durationMs={0} />
            <Transition.Change interpolation="easeInOut" durationMs={100} />
            <Transition.In type="fade" durationMs={10} />
        </Transition.Sequence>
    );

    const ref = useRef();

    return (
        <Container
            onPress={() => {
                ref.current.animateNextTransition();
                onPress();
            }}>
            <Background
                focused={focused}
                label={label}
                ref={ref}
                transition={transition}>
                <Icon source={icon} />
                {focused && (
                    <Label label={label}>
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                    </Label>
                )}
            </Background>
        </Container>
    );
}

export default Tab;