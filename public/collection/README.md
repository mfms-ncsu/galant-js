To create a json file of graphs for the list of examples, do the following.
* make sure all the graphs are listed in in the desired order in file_list.txt in subdirectories algorithms, graphs, and layered-graphs; one way to do this is `ls > file_list.txt` and then move the files around into the desired order
* do the following in all three subdirectories
```
../../../conversion-scripts/dir2index.py -F json -f "`cat file_list.txt`" "" > tmp.json
```
* move the json file in `algorithms` to `../../../src/data/algorithms.json`
* Use a text editor to combine the two json files from graphs and layered-graphs into a single list and save the result as `../../../src/data/graphs.json`
* delete all the `tmp.json` files
