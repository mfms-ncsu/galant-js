# a simple awk script to set up edge weights in a gph file to correspond to distances between nodes
# numbers will be scaled by a factor of 5 unless the number in the last line is changed

/^[cg]/ {print}
/^n/ { x[$2] = $3;
       y[$2] = $4;
       print }
/^e/ { x_diff = x[$2] - x[$3];
       y_diff = y[$2] - y[$3];
       raw = sqrt(x_diff * x_diff + y_diff * y_diff);
       dist = 1 + int(raw / 5);
       print $1, $2, $3, dist }