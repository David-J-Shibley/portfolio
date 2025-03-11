import { useGame } from '../context/GameContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MoveHistory = () => {
  const { gameState } = useGame();

  if (!gameState || gameState.moves.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Move History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No moves yet</p>
        </CardContent>
      </Card>
    );
  }

  // Pair moves (white and black) for display
  const movesPaired = [];
  for (let i = 0; i < gameState.moves.length; i += 2) {
    movesPaired.push({
      number: Math.floor(i / 2) + 1,
      white: gameState.moves[i],
      black: i + 1 < gameState.moves.length ? gameState.moves[i + 1] : null,
    });
  }

  // Format a move for display
  const formatMove = (move: typeof gameState.moves[0]) => {
    const notation = `${move.from}-${move.to}`;
    const checkStatus = move.isCheck ? '+ ' : move.isCheckmate ? '# ' : '';
    return `${notation}${checkStatus}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>White</TableHead>
              <TableHead>Black</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movesPaired.map((pair) => (
              <TableRow key={pair.number}>
                <TableCell className="font-medium">{pair.number}</TableCell>
                <TableCell>{formatMove(pair.white)}</TableCell>
                <TableCell>{pair.black ? formatMove(pair.black) : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;