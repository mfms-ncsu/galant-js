#! /usr/bin/env python3

"""
 converts a simple dialect of graphml - the one currently produced by Galant,
 to a gph format with weights on nodes and edges.

 weighted gph format is as follows:

    c comment line 1
    ...
    c comment line k

    g number_of_vertices

    n id_1 x_1 y_1 weight_1
    ...
    n id_n x_n y_n weight_n

    e source_1 target_1 length_1
    ...
    e source_m target_m length_m

 x_i y_i numbers on each 'n' line are positions (x and y coordinates);
 if the graphml file does not specify coordinates they default to 0

 input comes from stdin and output goes to stdout so it can be used as a filter

"""

import sys;
import argparse;

def parse_arguments():
    parser = argparse.ArgumentParser(
        description = "converts a graphml file, as used by Galant, to a gph file"
        + " with node and edge weights"
    )
    parser.add_argument("input_file", help = "an input file name or '-' to indicate stdin")
    parser.add_argument("-o", "--output_file", help = "output file, stdout if not specified")
    parser.add_argument("-dnw", "--default_node_weight", type = int, default = 1,
                        help = "default node weight (1 if not specified)")
    parser.add_argument("-dew", "--default_edge_weight", type = int, default = 1,
                        help = "default edge weight (1 if not specified)")
    return parser.parse_args()

def parse_graph(input_lines):
    """
    @param input_lines a list of lines (strings) of the input graphml
    description with each line a description of a node or edge (it's assumed
    that each is on a single line)

    @return a list of comments, one string per line
    and a list of lists; each sublist takes the form
    [type [attr value] ... [attr value]]
    where type is either 'node' or 'edge'
    """
    comments = get_comments(input_lines)
    internal_representation = []
    for i in range(0, len(input_lines)):
        current_line = input_lines[i].strip().strip('</>').split()
        if current_line[0] == 'graph':
            break

    for j in range(i + 1, len(input_lines)):
        current_line = input_lines[j].strip().strip('</>').split()
        if current_line[0] == 'node':
            internal_representation.append(parse_node(current_line))
        elif current_line[0] == 'edge':
            internal_representation.append(parse_edge(current_line))
    return comments, internal_representation

def get_comments(input_lines):
    """
    @return a list of strings, one for each line of comments,
    where the comments are between <comments> and </comments>
    @param input_lines a list of strings representing the file contents
    """
    comments = []
    comment_started = False
    for line in input_lines:
        line_list = line.strip().split()
        if not comment_started and len(line_list) > 0 and line_list[0] == '<comments>':
            comment_started = True
        elif comment_started:
            if len(line_list) > 0 and line_list[0] == '</comments>':
                # reached end of comment
                break
            comments.append(line.strip())
    return comments

def parse_node(node_line):
    """
    @param node_line a single input line for a node with the '<' and the
    '/>' stripped away
    @return a list of lists of the form ['node' [attr value] ... [attr value]]
    """
    node_attributes = ['node']
    # pretty simple, just collect the attributes into a list
    for i in range(1, len(node_line)):
        attribute_pair = node_line[i].split('=')
        if len(attribute_pair) < 2:
            continue
        attribute_pair[1] = attribute_pair[1].strip('"')
        if attribute_pair[1] != '':
            node_attributes.append(attribute_pair)
    return node_attributes

def parse_edge(edge_line):
    """
    @param edge_line a single input line for an edge with the '<' and the
    '/>' stripped away
    @return a list of lists of the form ['edge' [attr value] ... [attr value]]
    """
    # pretty simple, just collect the attributes into a list, except that
    # source and target should come first (for convenience)
    edge_attributes = ['edge']
    for i in range(1, len(edge_line)):
        attribute_pair = edge_line[i].split('=')
        if len(attribute_pair) < 2:
            continue
        attribute_pair[1] = attribute_pair[1].strip('"')
        if attribute_pair[1] != '':
            edge_attributes.append(attribute_pair)
    return edge_attributes

def write_comments(out_stream, comments):
    """
    prints comments in gph format
    """
    for comment in comments:
        out_stream.write("c {}\n".format(comment))

def write_node(out_stream, attribute_list):
    """
    prints attributes of a node in gph format, default weight = 1
    """
    weight = _args.default_node_weight
    x_coordinate = 0
    y_coordinate = 0
    for index in range(1, len(attribute_list)):
        prop_pair = attribute_list[index]
        prop = prop_pair[0]
        value = prop_pair[1]
        if prop == 'id': identifier = int(value)
        elif prop == 'weight': weight = int(float(value))
        elif prop == 'x': x_coordinate = int(value)
        elif prop == 'y': y_coordinate = int(value) 
    out_stream.write("n {} {} {} {}\n".format(identifier, x_coordinate, y_coordinate, weight))

def write_edge(out_stream, attribute_list):
    """
    prints attributes of an edge in gph format, default weight = 1
    """
    weight = _args.default_edge_weight
    for index in range(1, len(attribute_list)):
        prop_pair = attribute_list[index]
        prop = prop_pair[0]
        value = prop_pair[1]
        if prop == 'source': source = int(value)
        elif prop == 'target': target = int(value)
        elif prop == 'weight': weight = int(float(value))
    out_stream.write("e {} {} {}\n".format(source, target, weight))

"""
prints the internal representation in gph format
"""
def write_gph(out_stream, comments, internal_representation):
    write_comments(out_stream, comments)
    node_items = [x for x in internal_representation if x[0] == 'node']
    edge_items = [x for x in internal_representation if x[0] == 'edge']
    out_stream.write("g {} {}\n".format(len(node_items), len(edge_items)))
    for x in node_items: write_node(out_stream, x)
    for x in edge_items: write_edge(out_stream, x)

if __name__ == '__main__':
    global _args
    _args = parse_arguments()
    in_stream = sys.stdin
    if _args.input_file != '-':
        in_stream = open(_args.input_file, 'r')
    out_stream = sys.stdout
    if _args.output_file:
        out_stream = open(_args.output_file, 'w')
    input_lines = in_stream.readlines()
    comments, internal_representation = parse_graph(input_lines)
    write_gph(out_stream, comments, internal_representation)
