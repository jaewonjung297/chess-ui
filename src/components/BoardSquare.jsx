import { useDrop } from 'react-dnd';

function BoardSquare({ rowIndex, colIndex, onDrop, children }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHESS_PIECE',
    drop: (item) => onDrop(item, { rowIndex, colIndex }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop} // Attach drop behavior to the square
      className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${
        isOver ? 'highlight' : ''
      }`}
    >
      {children} {/* Render the piece as a child */}
    </div>
  );
}

export default BoardSquare;
