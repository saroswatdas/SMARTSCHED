# SMARTSCHED — Smart CPU Process Scheduler

A C-based CPU scheduling simulation using Operating Systems and DSA concepts.

## Algorithms
- FCFS — FIFO/Queue
- SJF — Sorting by burst time
- Round Robin — Circular queue concept
- Priority Scheduling — Priority-based selection

## Working
1. Accept process information.
2. Run each scheduling algorithm.
3. Calculate average waiting time.
4. Compare the results.
5. Select the algorithm with minimum waiting time.

## Compile and Run

```bash
gcc smartsched.c -o smartsched
./smartsched
```

## Process Data
P1: Burst 8, Priority 3  
P2: Burst 4, Priority 1  
P3: Burst 6, Priority 2  
P4: Burst 3, Priority 4

The project is a simulation framework, not an OS kernel.
