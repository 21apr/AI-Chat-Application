import './LeftMenu.scss'
import { useUser } from '../../../contexts/UserContext';

const LeftMenu: React.FC = () => {
  const { userChats, loading, error } = useUser();

  const currentPath = window.location.pathname;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <nav>
      <ul>
      <li>
          <a href="/" className={currentPath === '/' ? 'active' : ''}>New chat</a>
        </li>
        {userChats && userChats.map((chat) => (
          <li key={chat._id}>
            <a
              href={`/chats/${chat._id}`}
              className={currentPath === `/chats/${chat._id}` ? 'active' : ''}
            >
              <div>{chat.name}</div>
              <div style={{ fontSize: "0.6em", color: "gray" }}>Updated {new Date(chat.lastUpdated).toLocaleString()}</div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LeftMenu