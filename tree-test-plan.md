# Test plan for trees and tree algorithms

What follows is a sequence of tests for trees and related algorithms. They should be run using Chrome on all three platforms.
And, for each algorithm, it is important to check whether undoing and redoing several steps works correctly.

## Arbitrary trees

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

### insertion sequence (see Goodrich, Tamassia, and Goldwasser)

* 4, 7
* 12 - rotate so 7 becomes root
* 15 - recolor so that 15 only is red
* 3, 5
* 14 - rotate so 14 has 12 and 15 as children
* 18 - recolor 12 and 15 black
