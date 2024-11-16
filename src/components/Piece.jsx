import { useDrag } from 'react-dnd';

function ChessPiece({ piece, rowIndex, colIndex, isAnimating}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHESS_PIECE',
    item: { rowIndex, colIndex, piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (piece === 'X') return null; 
  return (
    <img
      ref={drag} // Attach drag behavior ONLY to this img element
      src={`/${piece}.png`}
      alt={piece}
      className={'chess-piece'}
      style={{
        opacity: isDragging ? 0 : 1, // Hide the piece when dragging
        cursor: 'grab', // Add a grab cursor for better UX
      }}
    />
  );
}

export default ChessPiece;
