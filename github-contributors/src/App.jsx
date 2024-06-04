import React, { useState } from "react";
import styled from "styled-components";
import { contributorImages, contributorLinks } from "./contributors";

const Header = styled.h1`
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Overlay = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color);
  color: #fff;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const AvatarContainer = styled.div.attrs((props) => ({
  style: {
    "--color": props.color,
  },
}))`
  position: relative;
  width: 50px;
  height: 50px;
  border: 3px solid var(--color);
  border-radius: 50%;
  overflow: hidden;
`;

// split out the dynamic part away from the styled component
// 1. inline style attribute
// 2. .attrs() on the component (and, again, inline style attribute)
// 3. use CSS variables

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const Button = styled.button`
  margin-bottom: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const App = () => {
  const [contributors, setContributors] = useState([]);

  const handleClick = () => {
    if (contributors.length === 0) {
      const contributors = Array.from({ length: 100 }, (_, index) => ({
        image: contributorImages[index % contributorImages.length],
        color: getRandomColor(),
        link: contributorLinks[index % contributorImages.length],
      }));
      setContributors(contributors);
    } else {
      setContributors([]);
    }
  };

  return (
    <div className="h-[100px]">
      <Header>Contributors to priceline/design-system</Header>
      <Button onClick={handleClick}>
        {contributors.length === 0 ? "Show" : "Hide"} contributors
      </Button>
      <Container>
        {contributors.map((contributor, index) => (
          <AvatarContainer key={index} color={contributor.color}>
            <Avatar src={contributor.image} />
            <Overlay href={contributor.link} target="_blank">
              🔗
            </Overlay>
          </AvatarContainer>
        ))}
      </Container>
    </div>
  );
};

export default App;
