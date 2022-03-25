import React, {useState} from 'react';

import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import axios from 'axios';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';

const App = () => {
  const [state, setstate] = useState('');
  const [meaning, setMeaning] = useState([]);
  let array_meaning = [];
  const [arr, setArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function fetchData() {
    setLoader(true);
    setNotFound(false);
    await axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${state}`)
      .then(res => {
        if (res.data !== []) {
          let data = JSON.parse(JSON.stringify(res.data[0]));
          setMeaning(data);
          if (data.meanings !== undefined) {
            data.meanings.forEach(type => {
              if (Object.keys(type) !== undefined) {
                if (Object.keys(type.partOfSpeech !== undefined)) {
                  array_meaning.push({
                    partofspeech: type.partOfSpeech,
                    definition: type.definitions[0].definition,
                    example: type.definitions[0].example,
                    synonyms: type.definitions[0].synonyms,
                  });
                }
              }
            });
          }
        }
        setLoader(false);
        setArr(array_meaning);
        mappedArray();
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
        setNotFound(true);
      });
  }

  const mappedArray = () => {
    return arr.map((item, index) => (
      <View key={index} style={{}}>
        <View
          style={{
            backgroundColor: '#DFDDC6',

            padding: '5%',
            borderRadius: 20,
            marginTop: '2%',
          }}>
          <Text
            style={{
              fontSize: 27,
              fontWeight: 'bold',
              color: '#777D71',
              marginBottom: '2%',
            }}>
            {item.partofspeech}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'serif',
              letterSpacing: 2,
              fontWeight: 'bold',
            }}>
            definition
          </Text>
          <Text style={{fontFamily: 'serif', fontSize: 17}}>
            {item.definition}
          </Text>
          {item.example ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'serif',
                  letterSpacing: 2,
                  fontWeight: 'bold',
                }}>
                example
              </Text>
              <Text style={{fontFamily: 'serif', fontSize: 17}}>
                {item.example}
              </Text>
            </View>
          ) : null}
          {item.synonyms.length > 1 ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'serif',
                  letterSpacing: 2,
                  fontWeight: 'bold',
                }}>
                synonyms
              </Text>
              <Text style={{fontFamily: 'serif', fontSize: 17}}>
                {item.synonyms.join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    ));
  };
  const PlayRemoteURLSoundFile = () => {
    Sound.setCategory('Playback');
    var myRemoteSound = new Sound(
      `https:${meaning.phonetics[0].audio}`,
      null,
      error => {
        if (error) {
          console.log(error);
          return;
        } else {
          myRemoteSound.play(success => {
            if (success) {
              console.log('Sound playing');
            } else {
              console.log('Issue playing file');
            }
          });
        }
      },
    );
    myRemoteSound.setVolume(1);
    myRemoteSound.release();
  };

  return (
    <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
      <View
        style={{
          padding: '2%',
          paddingBottom: '5%',
          paddingTop: '5%',
          backgroundColor: '#F8F6E7',
          height: '100%',
          width: '100%',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <StatusBar
          hidden={false}
          backgroundColor="#DFDDC6"
          translucent={false}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',

            justifyContent: 'space-between',
            marginBottom: '3%',
            borderBottomLeftRadius: 20,
          }}>
          <TextInput
            style={{
              color: 'black',
              fontSize: 20,
              backgroundColor: '#DFDDC6',

              width: '80%',
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
              padding: '3%',
              paddingLeft: '5%',
            }}
            placeholder="Enter word"
            placeholderTextColor="black"
            onChangeText={userInput => {
              setstate(userInput);
            }}
            value={state}
            placeholderTextColor="#777D71"
          />
          <TouchableOpacity
            onPress={() => fetchData()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '20%',
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
              borderWidth: 3,
              borderLeftWidth: 0,
              borderColor: '#DFDDC6',
              backgroundColor: '#F8F6E7',
            }}>
            <Image tintColor="black" source={require('./assets/search.png')} />
          </TouchableOpacity>
        </View>

        {meaning.hasOwnProperty('word') && notFound == false ? (
          <ScrollView
            style={{padding: '1%'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: '#DFDDC6',

                padding: '5%',
                borderRadius: 20,
                marginTop: '2%',
              }}>
              <Text
                style={{
                  fontFamily: 'monospace',
                  fontSize: 46,
                  fontWeight: 'bold',
                }}>
                {meaning.word}.
              </Text>

              <Text
                style={{fontSize: 25, fontWeight: 'bold', color: '#777D71'}}>
                origin
              </Text>
              <Text style={{fontFamily: 'serif', fontSize: 17}}>
                {meaning.origin}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#DFDDC6',

                padding: '5%',
                borderRadius: 20,
                marginTop: '2%',
              }}>
              <Text
                style={{
                  fontSize: 27,
                  fontWeight: 'bold',
                  color: '#777D71',
                }}>
                pronunciation
              </Text>
              <View
                style={{
                  backgroundColor: '#BCD38B',

                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: '5%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    fontSize: 28,

                    color: 'black',
                    letterSpacing: 3,
                    fontFamily: 'sans-serif-medium',
                  }}>
                  Listen
                </Text>
                <TouchableOpacity onPress={() => PlayRemoteURLSoundFile()}>
                  <Image
                    tintColor="black"
                    source={require('./assets/play_arrow.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {mappedArray()}
          </ScrollView>
        ) : null}
      </View>
      {loader ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: '#F8F6E7',
          }}>
          <LottieView
            source={require('./assets/loader.json')}
            autoPlay
            loop
            style={{height: 300, width: 300}}
          />
        </View>
      ) : null}
      {notFound ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            height: '60%',
            width: '100%',

            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: 40,
              color: '#777D71',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
            Not Found
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: '#777D71',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
            ¯\_(ツ)_/¯
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default App;
