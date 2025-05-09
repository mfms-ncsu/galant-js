#! /usr/bin/env python3

"""
Creates a file with an "entry" for each meaningful file in the
current directory. Meaningful excludes executables and editor backups; this
can be further restricted by specifying the desired files with the
  --files
option. The output format can be html, markdown or plain text.
In html and markdown the entries are items in a bulleted list.
"""

import argparse
import glob
import os
import sys

MY_NAME = 'Matthias F. (Matt) Stallmann'
MY_URL = "http://mfms.wordpress.ncsu.edu"

def parse_arguments():
    parser = argparse.ArgumentParser(
        description = "creates an index file for the current directory in a specified format"
    )
    parser.add_argument("title", help="title for the index file")
    parser.add_argument("-f", "--files",
                        help="a string specifying the files to be indexed; can contain Unix wildcards")
    parser.add_argument("-d", "--directories", action="store_true",
                        help="add an entry for each subdirectory, with a link to its index file, if any")
    parser.add_argument("-o", "--output", help="output file, stdout if not specified")
    parser.add_argument("-c", "--comments",
                        help="comment file - file containing text to be inserted before the list")
    parser.add_argument("-F", "--format", help="output format, one of html (default), md, txt, or json",
                        default="html")
    return parser.parse_args()

def get_date():
    return os.popen('date').readline().strip()

# short and sweet from StackOverflow
def remove_prefix(text, prefix):
    return text[text.startswith(prefix) and len(prefix):]

def harvest_line_comment(filename, prefix):
    """
    @return the first comment in the file (as a list of lines),
            where each line of the comment in the source file
            begins with the given prefix
    """
    comment = []
    with open(filename, 'r') as stream:
        comment_found = False
        for line in stream:
            if line.startswith(prefix):
                comment_found = True
                comment.append(remove_prefix(line, prefix).rstrip())
            elif comment_found:
                # reached end of comment
                break
    return comment

def harvest_multiline_comment(filename, start, end, prefix):
    """
    @return the first comment in the file (as a list of lines)
    @param start the string at the beginning of a comment
    @param end the string that ends a comment
    @param prefix a string that may appear at the beginning of intermediate comment lines,
           and should be removed
    assumes that start and end are each on a line by themselves
    """
    comment = []
    with open(filename, 'r') as stream:
        comment_started = False
        for line in stream:
            line_list = line.strip().split()
            if not comment_started and len(line_list) > 0 and line_list[0] == start:
                comment_started = True
            elif comment_started:
                if len(line_list) > 0 and line_list[0] == end:
                    # reached end of comment
                    break
                comment.append(remove_prefix(line, prefix).rstrip())
    return comment

def is_backup(filename):
    if filename[-1] == '~': return True
    return False

def is_directory(filename):
    return get_file_type(filename) == 'directory'

def get_file_type(filename):
    """
    @return the type of the file as a string, based on either the unix 'file' command
            or the extension
    """
    filetype = os.popen("file {}".format(filename)).readline().strip()
    extension = filename.split('.')[-1]
    if 'C++' in filetype:
        return 'c++'
    elif 'c program' in filetype:
        return 'c'
    elif 'Java' in filetype or extension == 'alg' or extension == 'js':
        return 'java'
    elif 'python' in filetype or extension == 'py' or extension == 'jl':
        # julia has same style comments as python
        return 'python'
    elif 'shell' in filetype or extension == 'sh' or extension == 'csh':
        return 'shell'
    elif 'makefile' in filetype:
        return 'makefile'
    elif extension == 'graphml':
        return 'graphml'
    elif extension == 'gph' or extension == 'sgf' or extension == 'cnf':
        return 'dimacs'
    elif extension == 'snap':
        return 'snap'
    elif extension == 'lp' or extension == 'lpx':
        return 'lp'
    elif filetype == 'directory':
        return 'directory'
    elif extension == 'md':
        return 'markdown'
    return 'other'

def harvest_comments(file_list):
    """
    @return a list of the form [(filename, comment), ... ]
            where each filename is in the file_list and each comment is
            list of strings representing a comment harvested from the
            beginning of the file (if possible)
    """
    files_with_comments = []
    for filename in file_list:
        comment = []
        filetype = get_file_type(filename)
        if filetype == 'c++':
            comment = harvest_line_comment(filename, '///')
        elif filetype== 'c' or filetype == 'java':
            comment = harvest_multiline_comment(filename, '/**', '*/', ' *')
        elif filetype == 'python':
            comment = harvest_multiline_comment(filename, '"""', '"""', '')
        elif filetype == 'shell' or filetype == 'makefile':
            # space added so that #! is ignored
            comment = harvest_line_comment(filename, '# ')
        elif filetype == 'graphml':
            comment = harvest_multiline_comment(filename, '<comments>', '</comments>', '')
        elif filetype == 'dimacs':
            comment = harvest_line_comment(filename, 'c')
        elif filetype == 'snap':
            comment = harvest_line_comment(filename, '#')
        elif filetype == 'lp':
            comment = harvest_line_comment(filename, '\\')
        elif filetype == 'markdown':
            comment = harvest_line_comment(filename, '[//]: #')
        else:
            comment == []
        files_with_comments.append((filename, comment))
    return files_with_comments

def filter_files(name_list):
    """
    @return two lists, one of the regular (non-backup) files and one of directories
    """
    dir_list = []
    file_list = []
    for filename in name_list:
        if is_backup(filename):
            continue
        if _args.output and filename == _args.output:
            # ignore output file
            continue
        if is_directory(filename):
            dir_list.append(filename)
        else:
            file_list.append(filename)
    return file_list, dir_list

def filter_directories(dir_list):
    """
    @return a list of directories that contain index files
    """
    return [directory for directory in dir_list if 'index.html' in os.listdir(directory)]

def get_comment_file_contents(comment_stream):
    """
    @return the contents of the file (comment_stream) as a list, one element per line
    """
    comment_file_contents = []
    for line in comment_stream:
        comment_file_contents.append(line.rstrip())
    return comment_file_contents

def write_comments(out_stream, comment_list):
    """
    write the comments in comment_list, one per line on out_stream,
    preformatted in html to preserve line breaks and indentation, as is in other formats
    """
    if _args.format == "html":
        out_stream.write('<pre>\n')
    if _args.format == "json":
        description = "\\n".join(comment_list)
#        description = description.replace("\n", "\\n")
        description = description.replace('"', r'\"')
        description = description.expandtabs()
        out_stream.write('\t\t"description": "{}"\n'.format(description))
    else:
        for comment in comment_list:
            out_stream.write('{}\n'.format(comment))
    if _args.format == "html":
        out_stream.write('</pre>\n')

def write_preamble(out_stream):
    if _args.format == "html":
        out_stream.write('<html> <head>\n')
        out_stream.write('<title>{}</title>\n'.format(_args.title))
        out_stream.write('</head>\n\n')
        out_stream.write('<body>\n')
        out_stream.write('<h2 align="center">{}</h2>\n\n'.format(_args.title))
    elif _args.format == "md":
        out_stream.write("# {}\n\n".format(_args.title))
    elif _args.format == "txt":
        out_stream.write("** {} **\n\n".format(_args.title))

first_json_item = True

def write_item(out_stream, name, link, comment_list):
    """
    writes a list item with the given name, the link,
    and the list of comments, one per line
    """
    global first_json_item
    if _args.format == "html":
        out_stream.write('<li>\n')
        out_stream.write('<strong><a href="{}">{}</a> --</strong><br>\n'.format(link, name))
    elif _args.format == "md":
        out_stream.write("* **[{}]({}) -**\n".format(name, link))
    elif _args.format == "json":
        if not first_json_item:
            out_stream.write(',\n')
        first_json_item = False
        out_stream.write("\t{\n")
        out_stream.write('\t\t"name": "{}",\n'.format(name))
        with open(name, "r") as file:
            content_string = file.read().replace("\n", "\\n")
        content_string = content_string.replace('"', r'\"')
        content_string = content_string.expandtabs()
        out_stream.write('\t\t"content": "{}",\n'.format(content_string))
    else:
        out_stream.write("{} --\n".format(name))
    write_comments(out_stream, comment_list)
    if _args.format == "html":
        out_stream.write('</li>\n')
    elif _args.format == "json":
        out_stream.write('\t}')
    else:
        out_stream.write('-------\n')

def write_dir_list(out_stream, dir_list):
    if _args.format == "html":
        out_stream.write('<h3>Subdirectories with links to their index files</h3>\n')
        out_stream.write('<hr>\n')
        out_stream.write('<ul>\n')
        for directory in dir_list:
            write_item(out_stream, directory, directory + '/index.html', [])
            out_stream.write('<hr><br>\n')
        out_stream.write('</ul>\n')
    elif _args.format == "md":
        out_stream.write('## Subdirectories with links to their index files\n')
        for directory in dir_list:
            write_item(out_stream, directory, directory + '/index.md', [])
    else:
        out_stream.write('** Subdirectories - look for index files **\n')

def write_file_list(out_stream, dir_list, file_list):
    """
    writes each filename with a link to the file and comments if they exist;
    directories with links to their index files are written first
    """
    if dir_list != []:
        write_dir_list(out_stream, dir_list)

    if _args.format == "html":
        out_stream.write('<h3>Files in lexicographic order</h3>\n')
        out_stream.write('<hr>\n')
        out_stream.write('<ul>\n')
    elif _args.format == "json":
        out_stream.write("[\n")
    for file_with_comments in file_list:
        filename = file_with_comments[0]
        comments = file_with_comments[1]
        write_item(out_stream, filename, filename, comments)
        if _args.format == "html":
            out_stream.write('<hr><br>\n')
    if _args.format == "html":
        out_stream.write('</ul>\n')
    elif _args.format == "json":
        out_stream.write("\n]\n")

def write_ending(out_stream):
    if _args.format == "html":
        out_stream.write('<address>\n')
        out_stream.write('<a href="{}">{}</a><br>\n'.format(MY_URL, MY_NAME))
        out_stream.write('Created: {}\n'.format(get_date()))
        out_stream.write('</address>\n')
        out_stream.write('</body> </html>\n')
    elif _args.format == "md":
        out_stream.write('[{}]({})\n'.format(MY_NAME, MY_URL))
        out_stream.write('Created: {}\n'.format(get_date()))
    elif _args.format == "txt":
        out_stream.write('{}, website = {}\n'.format(MY_NAME, MY_URL))
        out_stream.write('Created: {}\n'.format(get_date()))

def write_output(out_stream, comment_list, dir_list, filenames_with_comments):
    write_preamble(out_stream)
    if _args.format != "json":
        write_comments(out_stream, comment_list)
    write_file_list(out_stream, dir_list, filenames_with_comments)
    write_ending(out_stream)

if __name__ == "__main__":
    global _args
    _args = parse_arguments()
    if _args.files:
        file_specs = _args.files.split()
        name_list = []
        for spec in file_specs:
            name_list.extend(glob.glob(spec))
    else:
        name_list = os.listdir()
    file_list, dir_list = filter_files(name_list)
    if _args.directories:
        dir_list = filter_directories(dir_list)
    else:
        dir_list = []
    file_list.sort()
    dir_list.sort()
    filenames_with_comments = harvest_comments(file_list)
    # get comments from the comments file if requested
    comment_list = []
    if _args.comments:
        comment_stream = open(_args.comments, 'r')
        comment_list = get_comment_file_contents(comment_stream)
    out_stream = sys.stdout
    if _args.output:
        out_stream = open(_args.output, 'w')
    write_output(out_stream, comment_list, dir_list, filenames_with_comments)
