# NSquare Puzzle Solver

The NSquare puzzle solver finds the solution to a simple 3x3 n-square puzzle. An 3x3 n-square puzzle contains 8 tiles in a 9 square grid labeled with the numbers 1-8. Tiles adjacent to the empty space can be moved into the space. The goal is to randomly move the pieces from the initial state and then attempt to get them back into the initial positions.
 
 
## Program Goals
The goals of this program are as follows:

1. Implement a simple search algorithm that solves the puzzle.
1. To dynamically display the search tree as it is being modified by the algorithm.

I also wanted to improve my javascript and d3 skills.
 
## How it works...
When the puzzle is displayed, either manually mix up the puzzle by clicking on the squares, or enter a number of steps and click the "Randomize" button. 

After the puzzle has been mixed up, click the "Solve" button to start the search for a solution. The right-hand side of the display will show the search tree as it is being populated. Red circles indicate the nodes that are currently in the frontier.
