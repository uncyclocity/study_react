/*
useReducer : useState의 확장판
- 컴포넌트의 상태 업데이트 로직을 컴포넌트에서 분리할 수 있음(initialize 객체, reducer 함수)
ㄴ 바깥에, 별도 파일에 작성해서 불러올 수 있다
- 관리하는 상태 값이 여러개이고 구조가 복잡하다면 useState 대신 쓰면 편하다
- setter를 여러 번 써야 한다면 이를 쓰는 것이 편할 수 있다
ㄴ 예)useState Hook을 사용하면서 setUsers와 setInputs가 동시에 쓰임
  => initialize에 한번에 초기화, reducer 함수 하나로 type 값에 따른 값 변경
*/
import React, {useReducer, useMemo} from 'react';
import UserList from './UserList';
import CreateUser from './CreateUser';
//import produce from 'immer';

function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}

// useReducer에 사용되는 상태들을 초기화
const initialize = {
  users: [
    {
      id: 1,
      username: 'velopert',
      email: 'public.velopert@gmail.com',
      active: true
   },
   {
      id: 2,
      username: 'tester',
      email: 'tester@example.com',
      active: false
    },
    {
      id: 3,
      username: 'liz',
      email: 'liz@example.com',
      active: false
   }
  ]
};

// dispatch 함수 안의 객체 요소를 action.객체요소명 형식으로 불러올 수 있음
// state.state객체 형식으로 각 state객체를 불러올 수 있음
function reducer(state, action) {
  // immer 패키지를 이용하면 불변성을 신경쓰지 않고 코딩해도 자동으로 불변성을 지켜준다.
  // 기존 코드에 따라 더 짧아질 수 있지만, 더 길어질 수도 있다.
  // 되도록이면 데이터 구조가 복잡하게 되지 않는 쪽으로 코드를 짜고, 어쩔 수 없다면 필요한 부분에만 사용하는 편이 좋다.
  // produce(객체, 함수) : 새로운 상태를 만들어 줌
  /* 
    produce(함수) : 새로운 상태를 만들어 주는 함수가 됨(함수형 업데이트에 사용하면 딱임)
    예) 함수형 업데이트에 사용
    const [todo, setTodo] = useState({
      text: 'Hello',
      done: false
    });

    const onClick = useCallback(() => {
      setTodo(
        produce(draft => {
          draft.done = !draft.done;
        });
      )
    }, []);
  */
  // switch (action.type) {
  //   case "CREATE_USER" :
  //     return produce(state, draft => {
  //       draft.users.push(action.user);
  //     });
  //   case "TOGGLE_USER" :
  //     return produce(state, draft => {
  //       const user = draft.users.find(user => user.id === action.id);
  //       user.active = !user.active;
  //     });
  //   case "REMOVE_USER" :
  //     return produce(state, draft => {
  //       const userIndex = draft.users.findIndex(user => user.id === action.id);
  //       draft.users.splice(userIndex, 1);
  //     });
  //   default :
  //     return state;
  // }
  switch (action.type) {
    case "CREATE_USER":
      return {
        users: [...state.users, action.user],
      };
    case "REMOVE_USER":
      return {
        users: state.users.filter(user => user.id !== action.id)
      };
    case "TOGGLE_USER":
      return {
        users: state.users.map(user => 
          user.id === action.id ? {...user, active: !user.active} : user
        )
      };
    default:
      return state;
  }
}

// Context API와 dispatch를 이용하면, 여러 컴포넌트를 거쳐서 전달하는 것을 한큐에 해결할 수 있다
// export 하여 내보내면 import {UserDispatch} from './App' 형태로 
export const UserDispatch = React.createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialize);
  
  const {users} = state;

  const count = useMemo(() => countActiveUsers(users), [users]);

  return (
    // UserDispatch.Provider 태그로 감싼 범위의 컴포넌트 안에서 얼마든지 Dispatch를 사용할 수 있다.
    <UserDispatch.Provider value={dispatch}>
      <CreateUser/>
      <UserList users={users}/>
      <div>활성사용자수 = {count}</div>
    </UserDispatch.Provider>
  );
}

export default App;