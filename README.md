# redux-delux

redux-delux eliminates the boilerplate typically required to manage RESTful API transactions within a React/Redux application. Using redux-delux, you get Redux-like access to the data recieved from your API (along with metadata like loading and error status), all without writing a single reducer or action creator.

### Redux store setup

If you don't need to setup any of your own reducers, you can setup the redux store with rr.reducers.

```js
   import rd from 'redux-delux';
   
   export default(initialState) => {
     return createStore(
       rr.reducers,
       initialState,
       applyMiddleware(...middleware)
     );
   }
   
```

If you want to setup your own reducers, you can use rr.combineReducers.

```js
   import rd from 'redux-delux';
   
   export default(initialState) => {
     return createStore(
       rr.combineReducers({myData: myReducer}),
       initialState,
       applyMiddleware(...middleware)
     );
   }
   
```

### API setup

The redux-delux API for a project is defined as an object with request and task keys.

```js
    export default {
        request: {
          getItems,
          getItemsForUser
        },
        task: {
          createItem,
          deleteItem
        }
    };
``` 

#### Request

Requests are used get data from an API. Requests store the status (loading, error, response data) of the most recent call (in the requestStatus object in the store).

API requests can be defined either by a URL (string)

```js
    import rd from 'redux-delux';
    
    export default rr.apiRequest('/items');
```

or by a function that returns a URL (string)

```js
    import rd from 'redux-delux';
    
    const getItemsForUser = (userId) => {
        return `/items/user/${userId}`;
    };
    
    export default rr.apiRequest(getItems);
```

#### Task

Tasks are used to take an action (typically via an API). The status (loading, error, success) is saved for every task, but tasks do not automatically manage response data.

API tasks are defined by a function which returns an array of sub-tasks (functions). The example below will create a new item for a user, and then re-request the item list for that same user.

```js
    import rd from 'redux-delux';
    import getItemsForUser from "../getItemsForUser";
    import axios from 'axios';
    
    export const createItem = (userId, itemId, itemName, dispatch) => {
        const url = `/items`;
        const subTask1 = () => axios.post(url, {id: itemId, name: itemName, userId});
        const subTask2 = () => getItemsForUser.request(userId)(dispatch);
        return [subTask1, subTask2];
    };
    
    export default rr.apiTask(createItem);

```

Each sub-task receives an array containing the results of all previous sub-tasks as an argument. This makes it possible to update existing data in the store with the response of this task (such as a POST's response).

```js
    import rd from 'redux-delux';
    import getItems from "../getItems";
    import axios from 'axios';
    
    export const createItem = (itemName, dispatch) => {
        const url = `/apps`;
        const subTask1 = () => axios.post(url, {name: itemName});
        const subTask2 = (previousSubTaskResults) => getItems.patch(dispatch,
            (existingData)=> {
                const items = existingData;
                const newItem = previousSubTaskResults[0].data;
                const updatedItems = [...items, newItem];
                return updatedItems;
            }
        );        
        
        return [subTask1, subTask2];
    };
    
    export default rr.apiTask(createItem);

```

### redux-delux within React components

#### connect

The redux-delux api can be injected into React components using connect. As with react-redux, 'mapStateToProps' and 'mapDispatchToProps' are optional arguments. 

```js
    import rd from 'redux-delux';
    import api from './api'; // as defined above
    
    rr.connect(api, mapStateToProps, mapDispatchToProps)(Component)
```

#### usage

A connected component will be injected by react-redux with the following props (based on the API definition shown above).

```js
    this.props = {
        request:{
            getItems,
            getItemsForUser
        },
        requestStatus: {
            getItems,
            getItemsForUser
        },
        task: {
            createItem,
            deleteItem
        },
        taskStatus: function taskStatus(taskId){}
    }
```

##### request

request object is used to make a network request for data.

```js
    import rd from 'redux-delux';
    
    class App extends Component {
    
      componentDidMount(){
          this.props.request.getItemsForUser('userId-123')
      }
    
      render() {
          return (
              <p>My React App</p>
          );
      }
    }
    
    rr.connect(api)(App)
```

##### requestStatus

requestStatus object is used to get the results of a request network call.

```js
    import rd from 'redux-delux';
    
    class App extends Component {
    
      componentDidMount(){
          this.props.request.getItemsForUser('userId-123')
      }
    
      render() {
      
          const userItems = this.props.requestStatus.getItemsForUser('userId-123');
      
          return (
            {
                userItems.isLoading &&
                <p>Loading user data..</p>
            }
            {
                userItems.data &&
                <p>User data loading complete</p>
            }      
            <p>My React App</p>
          );
      }
    }
    
    rr.connect(api)(App)
```

##### task

task object is used to execute a redux-delux task.

```js
    import rd from 'redux-delux';
    
    class App extends Component {
    
      componentDidMount(){
          this.props.request.getItemsForUser('userId-123')
      }
    
      render() {
      
          const userItems = this.props.requestStatus.getItemsForUser('userId-123');
      
          return (
            {
                userItems.isLoading &&
                <p>Loading user data..</p>
            }
            {
                userItems.data &&
                <p>User data loading complete</p>
            }      
            <p>My React App</p>
            <button onClick={()=>{this.props.task.createItem('New Item Title')}}/>
          );
      }
    }
    
    rr.connect(api)(App)
```

##### taskStatus

taskStatus object is used to review the status of a task.

```js
    import rd from 'redux-delux';
    
    class App extends Component {
    
      constructor(){
        super();
        this.state = {taskId: ''}
      }
    
      componentDidMount(){
          this.props.request.getItemsForUser('userId-123')
      }
      
      createItem = async () => {
        const id = await this.props.task.createItem('New Item Title');
        this.setState({taskId: id});
      }
    
      render() {
      
          const userItems = this.props.requestStatus.getItemsForUser('userId-123');
          const taskStatus = this.props.taskStatus(this.state.taskId);
      
          return (
            {
                userItems.isLoading &&
                <p>Loading user data..</p>
            }
            {
                userItems.data &&
                <p>User data loading complete</p>
            }      
            <p>My React App</p>
            <button onClick={this.createItem}/>
            {
                taskStatus.isLoading &&
                <p>Adding item...</p>
            }
            {
                taskStatus.success &&
                <p>Item Added</p>
            }
          );
      }
    }
    
    rr.connect(api)(App)
```

##### Using redux-delux outside of React components

Status can be used to get the results of a network call. You must first pass the root state into the status function, and then call it with the arguments that are specified when the api request was setup.

```js
    // selectors.js

    export const selectorCoolItems = (state) => {
    
        const userId = state.uiState.userId;
        const itemsForUser = api.request.getItemsForUser.status(state)(userId);    
        
        // derive new data
        return itemsForUser.data.filter(item => (item.coolness > 10) );
    }
```


### watch out

- redux-delux uses _rr key in the root of the redux store
- redux-delux uses request, requestStatus, task, and taskStatus in this.props for connected components
- redux-delux uses redux actions with types starting with _rr 


