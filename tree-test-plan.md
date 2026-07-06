# Test plan for trees and tree algorithms

What follows is a sequence of tests for trees and related algorithms. They should be run using Chrome on all three platforms.
And, for each algorithm, it is important to check whether undoing and redoing several steps works correctly.

## Arbitrary trees

### Run `src/testing/sequencing.js`
- should create four nodes: 0, 1, 2, 3
- nodes 1, 2, 3 will become children of 0 in that order
- the order is changed to 2, 1, 3
- the order is changed to 3, 1, 2
- the order is changed to 3, 2, 1 (`setChildren` works with a subset of the children)
- an error occurs: no edge from 1 to 0
- it is still possible to step back and forth

### Preorder and postorder

Run `preorder_traversal.js` and `postorder_traversal.js` on any of the `ub?.tree` files in `tree-tests`

## Binary search trees

### insertion

7
4,3 - insert left twice
5 - insert right with left present
6 - insert right
9 - insert right with left present
10,11 - insert right twice
8 - insert left with right present

### deletion

create tree with insertion sequence 7,1,8,5,3,2,4
(-7) - finding greatest predecessor and shifting with right dummy
(-1) - shift with left dummy
(-4) - leaf

## Red/black trees

### insertion sequence 
- see Goodrich and Tamassia, *Algorithm Design*, pp. 175-6
- or Goodrich, Tamassia and Golwasser *Data Structures & Algorithms*, pp. 515-6

* 4, 7
* 12 - rotate so 7 becomes root (LL)
* 15 - recolor so that 15 only is red
* 3, 5
* 14 - rotate so 14 has 12 and 15 as children (RL)
* 18 - recolor 12 and 15 black
* 16 - rotate so 16 has 15 and 18 as children (LR)
* 17 - a recolor followed by a rotation that puts 14 at the root (RR)

### deletion sequence
 - see Goodrich and Tamassia, *Algorithm Design*, pp. 182-3

Start with tree from insertion sequence, saved as **public/collection/trees/rt-example.tree**

* -3
* -12 double black => restructure with subtree [4,5,7]
* -17
* -18 double black => recolor
* -15
* -16 double black => adjustment followed by recoloring
