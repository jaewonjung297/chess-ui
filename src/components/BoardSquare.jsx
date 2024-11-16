import { useDrop } from 'react-dnd';


function BoardSquare({ rowIndex, colIndex, onDrop, isSelected, children, onClick, isValidMove }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHESS_PIECE',
    drop: (item) => onDrop(item, { rowIndex, colIndex }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  return (
    <div
    onClick={onClick}
      ref={drop}
      className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${
        isOver ? 'highlight' : ''
      } ${isSelected ? 'selected' : ''}`} 
    >
      {children}
      {isValidMove && <div className="valid-move-dot"></div>}
    </div>
  );
}

export default BoardSquare;
