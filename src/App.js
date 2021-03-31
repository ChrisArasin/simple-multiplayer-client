import './App.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import network from './Network';

const serverUrl = 'https://simple-multiplayer-server.glitch.me';

function App() {
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const [selfPosition, setSelfPosition] = useState({ x: 250, y: 250 });
  const [selfColor, setSelfColor] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [players, setPlayers] = useState({});

  const handleStateUpdate = (players) => {
    setPlayers(players);
  };

  const handleUpdatePosition = (x, y) => {
    setSelfPosition({ x, y });
    network.sendPosition({ x, y });
  };

  useEffect(() => {
    // On mount:
    // - randomly choose a color
    // - connect to network
    const rand = Math.random();
    const color = rand < 0.33 ? 'red' : rand < 0.66 ? 'blue' : 'green';
    setSelfColor(color);
    network.init(serverUrl, color, setSelfId, handleStateUpdate);
  }, []);

  // window resize handler
  const handleResize = () => {
    setBoardOffset(offset(document.querySelector('.board')));
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app">
      <div
        className="board"
        onPointerDown={({ clientX, clientY }) => {
          handleUpdatePosition(
            clientX - boardOffset.x,
            clientY - boardOffset.y
          );
        }}
      >
        <div className="metaballs">
          {/* render all other players */}
          {Object.entries(players).map(([id, data]) => {
            if (id === selfId) return null;
            return (
              <Player
                key={`player${id}`}
                position={data.position}
                color={data.color}
              />
            );
          })}

          {/* render player separate from state updates for instant response */}
          <Player position={selfPosition} color={selfColor} />
        </div>
      </div>
    </div>
  );
}

// A Player's position is moved using React-Spring
function Player({ position, color = 'red' }) {
  const props = useSpring({
    transform: `translate3d(${position.x}px, ${position.y}px ,0)`,
    config: { mass: 1, tension: 70, friction: 10 },
  });
  return <animated.div className={`player ${color}`} style={props} />;
}

// Calculates page offset of our gameboard
function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { x: rect.left + scrollLeft, y: rect.top + scrollTop };
}

export default App;
