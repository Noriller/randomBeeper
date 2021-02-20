import { useEffect, useState } from 'react';
import styled from 'styled-components'
import useSound from 'use-sound';
import Chance from 'chance';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`
const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const Button = styled.button`
  height: 3em;
  margin: 5px;
`;

const Input = styled.input`
  height: 3em;
  margin: 5px;
`;

export default function Home() {

  const [play3] = useSound(
    '/pop-up-off.mp3',
    { volume: 10 }
  );

  const [doPlay, setDoPlay] = useState(false);
  const [bpm1, setBpm1] = useState(16);
  const [bpm2, setBpm2] = useState(20);
  const [mode, setMode] = useState(1);

  let timer = null;

  useEffect(() => {
    function beep(interval) {
      if (doPlay) {
        timer = setTimeout(() => {
          playBeep();
          beep(getRandomDelay());
        }, interval);
      }
    }
    beep(getRandomDelay());
    return () => clearTimeout(timer);
  }, [doPlay, bpm1, bpm2, mode]);

  function playBeep() {
    if (mode === 1) {
      play3();
      return;
    }

    const chance = new Chance();
    if (mode > 1)
      if (chance.bool({ likelihood: getRandom(25, 50) })) {
        playTimes(2);
        return;
      }

    if (mode === 3)
      if (chance.bool({ likelihood: getRandom(25, 50) })) {
        playTimes(3);
        return;
      }

    play3();
  }

  function handleChange1(e) {
    setBpm1(e.target.value);
  }
  function handleChange2(e) {
    setBpm2(e.target.value);
  }

  function getRandomDelay() {
    const min = (60 / bpm1) * 1000;
    const max = (60 / bpm2) * 1000;
    return getRandom(min, max);
  }

  useEffect(() => {
    console.log(bpm1, bpm2, doPlay, mode);
  }, [bpm1, bpm2, doPlay, mode]);

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handleDoPlay() {
    return setDoPlay(!doPlay);
  }

  function handleMode(e) {
    setMode(parseInt(e.target.value));
  }

  function playTimes(n) {
    const array = Array(n).fill(1);
    array.forEach((x, i) => {
      const time = setTimeout(() => { play3(); }, 250 * i);
      return () => clearTimeout(time);
    });
  }

  return (
    <>
      <Title>The annoying random Beeper</Title>

      <Div>

        <div>
          <Button onClick={() => playTimes(1)}>Play 1</Button>
          <Button onClick={() => playTimes(2)}>Play 2</Button>
          <Button onClick={() => playTimes(3)}>Play 3</Button>
        </div>
        <Button onClick={handleDoPlay}>
          {doPlay ? 'Stop Playing' : 'Start Playing'}
        </Button>

        <div>
          <label>BPM Min</label>
          <Input type="number"
            defaultValue={bpm1}
            onChange={handleChange1}
            id="BPM1"
            min={1}
            max={500}
          />
          <label>BPM Max</label>
          <Input type="number"
            defaultValue={bpm2}
            onChange={handleChange2}
            id="BPM2"
            min={1}
            max={500}
          />
        </div>

        <div onChange={handleMode} >
          <input type="radio" id="normal" name="mode" defaultChecked value="1" />
          <label >Normal</label>
          <input type="radio" id="double" name="mode" value="2" />
          <label >Double</label>
          <input type="radio" id="triple" name="mode" value="3" />
          <label >Triple</label>
        </div>

        <div>
          <pre>
            {`
            Basically a metronome that you can set a randomish interval.
            You also have three modes:
              normal = Play 1
              double = Play 2
              triple = Play 3
            That based on chance will play extra times.
            `}
          </pre>
        </div>

      </Div>

    </>

  )

}
