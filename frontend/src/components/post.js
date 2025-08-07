import Card from 'react-bootstrap/Card';

export const Post = ({ post }) => {
  const { author, content } = post;

  return (
    <Card style={{ width: '18rem' }} className='post'>
      <Card.Header className='post-author'>{author.username}</Card.Header>
      <Card.Body>
        <Card.Text className='post-content'>
          {content}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}