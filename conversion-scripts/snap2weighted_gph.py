#! /usr/bin/env python3

"""
 reads an unweighted graph in snap format and writes a gph version that can
 be used in a context that requires weights on both the nodes and the edges

 snap format uses  as a comment delimiter and each line represents an edge,
 given as two integers that are interpreted as vertex id's

 weighted gph format is as follows:

    c comment line 1
    ...
    c comment line k

    g number_of_vertices

    n id_1 weight_1
    ...
    n id_n weight_m

    e source_1 target_1 length_1
    ...
    e source_m target_m length_m

 sources and targets are vertex numbers starting at 1
"""

import sys
import random
from argparse import ArgumentParser
from argparse import RawTextHelpFormatter # to allow newlines in help messages

def parse_arguments():
    parser = ArgumentParser(description="converts an unweighted graph in snap format to a graph with random node and edge weights in gph format")
    parser.add_argument("input_file", help="input file in snap format; output file uses same base name with .gph extension")
    parser.add_argument("max_edge_weight", type = int, default = 99,
                        help = "maximum edge weight (default 99)")
    parser.add_argument("-mew", "--min_edge_weight", type = int, default = 1,
                        help = "minimum edge weight (default 1)")
    parser.add_argument("-s", "--seed",
                        help = "random seed (default is based on internal system state)",
                        type = int)
    parser.add_argument("-c", "--max_coordinates",
                        help = "maximum x- and y-coordinates for nodes (default 500)",
                        type = int, default = 500)
    return parser.parse_args()

# @param input the input stream from which the input is to be read
# @return a graph_tuple of the form:
#     (node_dictionary, [edge_1, ..., edge_m])
# where node_dictionary is a dictionary mapping node numbers to (integer) weights
# and each edge_i is a tuple of the form
#     (source, target, length)
def read_snap(input_stream):
    global _node_dictionary
    _node_dictionary = {}
    edge_list = []
    comments = []
    line = input_stream.readline()
    while line:
        line = line.strip()
        split_line = line.split()
        if len(split_line) == 0:
            comments.append(line)
            line = input_stream.readline()
            continue
        if split_line[0] == '#':
            comments.append(line[1:])
            line = input_stream.readline()
            continue
        node_one = int(split_line[0])
        node_two = int(split_line[1])
        if not node_one in _node_dictionary:
            x_coord = random.randint(1, _max_coordinates)
            y_coord = random.randint(1, _max_coordinates)
            _node_dictionary[node_one] = (x_coord, y_coord)
        if not node_two in _node_dictionary:
            x_coord = random.randint(1, _max_coordinates)
            y_coord = random.randint(1, _max_coordinates)
            _node_dictionary[node_two] = (x_coord, y_coord)
        edge_length = random.randint(_min_edge_weight, _max_edge_weight)
        edge_tuple = (node_one, node_two, edge_length)
        edge_list.append(edge_tuple)
        line = input_stream.readline()
    return edge_list, comments

def write_gph(output_stream, edge_list, comments):
    for comment in comments:
        output_stream.write("c %s\n" % comment)
    # use maximum node number instead of number of nodes
    output_stream.write("g %d %d\n" % (len(_node_dictionary), len(edge_list)))
    for node in _node_dictionary:
        output_stream.write("n %d %d %d\n"
                            % (node, _node_dictionary[node][0], _node_dictionary[node][1]))
    for edge_tuple in edge_list:
        output_stream.write("e %d %d %d\n" % edge_tuple)

if __name__ == '__main__':
    global _max_edge_weight
    global _min_edge_weight
    global _max_coordinates
    args = parse_arguments()
    random.seed(args.seed)
    _max_edge_weight = args.max_edge_weight
    _min_edge_weight = args.min_edge_weight
    _max_coordinates = args.max_coordinates
    input_stream = open(args.input_file, "r")
    edges, comments = read_snap(input_stream)
    # the following seems a little convoluted but does the job
    input_base_name = '.'.join(args.input_file.split('.')[:-1])
    output_file = input_base_name + ".gph"
    print("The output gph file is in ", output_file)
    output_stream = open(output_file, "w")
    write_gph(output_stream, edges, comments)
