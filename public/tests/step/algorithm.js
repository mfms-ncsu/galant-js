display("Automatic step");
for (let node of getNodes()) {
	print("Marked " + node);
	mark(node);
}

clearNodeMarks();

display("Functional step");
step(() => {
	for (let node of getNodes()) {
		print("Marked " + node);
		mark(node);
	}
});

clearNodeMarks();

display("Manual step");
disableAutoStep();

for (let node of getNodes()) {
	print("Marked " + node);
	mark(node);
}
display("Marked all nodes");
step();

clearNodeMarks();
step();

display("Functional step");
step(() => {
	for (let node of getNodes()) {
		print("Marked " + node);
		mark(node);
	}
});

clearNodeMarks();
step();

enableAutoStep();
display("Auto step was re-enabled");

