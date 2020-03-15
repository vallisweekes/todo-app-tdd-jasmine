{
    "type": 'ADD_NAME',
    "payload": 'Vallis'
}

const reducer = (prevState, action)=> {
    (action.type === 'ADD_NAME') ? [...prevState, something.action] : prevState;
} 