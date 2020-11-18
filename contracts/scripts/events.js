const ADIToken = artifacts.require('ADIToken');
const abi1 = [
  {
    indexed: false,
    internalType: 'address',
    name: 'to',
    type: 'address',
  },

];
const abi2 = [
  {
    indexed: false,
    internalType: 'address',
    name: 'to',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'someValue',
    type: 'uint256',
  },
];

const abi3 = [
  {
    indexed: false,
    internalType: 'address',
    name: 'to',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'someValue',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint8',
    name: 'anotherValue',
    type: 'uint8',
  },
];

const tryToDecode = (e) => {
  let decoded;
  try {
    decoded = web3.eth.abi.decodeLog(abi3,
      e.raw.data,
      e.raw.topics);
    return decoded;
  } catch (err3) {
    try {
      decoded = web3.eth.abi.decodeLog(abi2,
        e.raw.data,
        e.raw.topics);
      return decoded;
    } catch (err2) {
      try {
        decoded = web3.eth.abi.decodeLog(abi1,
          e.raw.data,
          e.raw.topics);
        return decoded;
      } catch (err1) {
        console.log(e);
        return null;
      }
    }
  }
};

const readAllEvents = async (adiToken) => {
  const foundEvents = await adiToken.getPastEvents('allEvents', { fromBlock: 0 });
  const allGreeted = foundEvents.filter((e) => e.event === 'Greeted');

  const decodedEvents = allGreeted.map((e) => {
    const decoded = tryToDecode(e);
    return decoded ? {
      event: e.event,
      to: decoded.to,
      someValue: decoded.someValue,
      anotherValue: decoded.anotherValue,
    } : {};
  });
  console.table(decodedEvents);
};

const readRegularEvents = async (adiToken) => {
  const regularEvents = await adiToken.getPastEvents('Greeted', { fromBlock: 0 });

  const events = regularEvents.map((event) => ({
    event: event.event,
    blockNumber: event.blockNumber,
    counter: event.returnValues.someValue,
    fortytwo: event.returnValues.anotherValue,
    to: event.returnValues.to,
  }));

  console.table(events);
};

module.exports = async function () {
  const adiToken = await ADIToken.deployed();
  await readRegularEvents(adiToken);
  await readAllEvents(adiToken);
};
