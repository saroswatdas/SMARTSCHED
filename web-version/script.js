// ============================================================
// SMARTSCHED v3
// CPU Scheduling Simulation Engine
// ============================================================


// ------------------------------------------------------------
// DEFAULT PROCESS DATA
// ------------------------------------------------------------

let processes = [
    {
        pid: "P1",
        arrival: 0,
        burst: 8,
        priority: 3
    },
    {
        pid: "P2",
        arrival: 0,
        burst: 4,
        priority: 1
    },
    {
        pid: "P3",
        arrival: 0,
        burst: 6,
        priority: 2
    },
    {
        pid: "P4",
        arrival: 0,
        burst: 3,
        priority: 4
    }
];


let comparisonChart = null;


// ------------------------------------------------------------
// DOM
// ------------------------------------------------------------

const processTableBody =
    document.getElementById("processTableBody");

const resultsBody =
    document.getElementById("resultsBody");

const metricsBody =
    document.getElementById("metricsBody");

const ganttChart =
    document.getElementById("ganttChart");

const processCount =
    document.getElementById("processCount");

const totalBurst =
    document.getElementById("totalBurst");

const quantumDisplay =
    document.getElementById("quantumDisplay");

const quantumInput =
    document.getElementById("quantum");


// ------------------------------------------------------------
// RENDER PROCESS TABLE
// ------------------------------------------------------------

function renderProcesses() {

    processTableBody.innerHTML = "";

    processes.forEach((process, index) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td class="pid-cell">
                ${process.pid}
            </td>

            <td>

                <input
                    class="process-input"
                    type="number"
                    min="0"
                    value="${process.arrival}"
                    data-index="${index}"
                    data-field="arrival"
                >

            </td>

            <td>

                <input
                    class="process-input"
                    type="number"
                    min="1"
                    value="${process.burst}"
                    data-index="${index}"
                    data-field="burst"
                >

            </td>

            <td>

                <input
                    class="process-input"
                    type="number"
                    min="1"
                    value="${process.priority}"
                    data-index="${index}"
                    data-field="priority"
                >

            </td>

            <td>

                <button
                    class="delete-btn"
                    data-index="${index}"
                >
                    ×
                </button>

            </td>
        `;

        processTableBody.appendChild(row);
    });


    updateSummary();
}


// ------------------------------------------------------------
// SUMMARY
// ------------------------------------------------------------

function updateSummary() {

    processCount.textContent =
        processes.length;

    const burst =
        processes.reduce(
            (sum, process) =>
                sum + Number(process.burst),
            0
        );

    totalBurst.textContent =
        burst;

    quantumDisplay.textContent =
        quantumInput.value;

    document.getElementById(
        "queueCount"
    ).textContent =
        `${processes.length} PROCESSES`;
}


// ------------------------------------------------------------
// PROCESS INPUT
// ------------------------------------------------------------

processTableBody.addEventListener(
    "input",
    event => {

        const input = event.target;

        if (!input.dataset.index) {
            return;
        }

        const index =
            Number(input.dataset.index);

        const field =
            input.dataset.field;

        processes[index][field] =
            Number(input.value);

        updateSummary();
    }
);


// ------------------------------------------------------------
// REMOVE PROCESS
// ------------------------------------------------------------

processTableBody.addEventListener(
    "click",
    event => {

        if (
            !event.target.classList.contains(
                "delete-btn"
            )
        ) {
            return;
        }

        const index =
            Number(
                event.target.dataset.index
            );

        processes.splice(index, 1);

        processes.forEach(
            (process, i) => {
                process.pid =
                    `P${i + 1}`;
            }
        );

        renderProcesses();
    }
);


// ------------------------------------------------------------
// ADD PROCESS
// ------------------------------------------------------------

document
    .getElementById("addProcessBtn")
    .addEventListener(
        "click",
        () => {

            const number =
                processes.length + 1;

            processes.push({
                pid: `P${number}`,
                arrival: 0,
                burst: 5,
                priority: number
            });

            renderProcesses();
        }
    );


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        () => {

            processes = [
                {
                    pid: "P1",
                    arrival: 0,
                    burst: 8,
                    priority: 3
                },
                {
                    pid: "P2",
                    arrival: 0,
                    burst: 4,
                    priority: 1
                },
                {
                    pid: "P3",
                    arrival: 0,
                    burst: 6,
                    priority: 2
                },
                {
                    pid: "P4",
                    arrival: 0,
                    burst: 3,
                    priority: 4
                }
            ];

            quantumInput.value = 2;

            renderProcesses();

            clearResults();
        }
    );


// ------------------------------------------------------------
// FCFS
// ------------------------------------------------------------

function fcfs(list) {

    const sorted =
        [...list].sort(
            (a, b) =>
                a.arrival - b.arrival
        );

    let time = 0;

    const result = [];
    const timeline = [];

    sorted.forEach(process => {

        if (
            time < process.arrival
        ) {
            time =
                process.arrival;
        }

        const start = time;

        time += process.burst;

        const completion = time;

        const turnaround =
            completion -
            process.arrival;

        const waiting =
            turnaround -
            process.burst;

        result.push({
            ...process,
            completion,
            turnaround,
            waiting
        });

        timeline.push({
            pid: process.pid,
            start,
            end: completion
        });
    });

    return {
        processes: result,
        timeline
    };
}


// ------------------------------------------------------------
// SJF
// ------------------------------------------------------------

function sjf(list) {

    const remaining =
        list.map(
            process => ({
                ...process
            })
        );

    const result = [];
    const timeline = [];

    let time = 0;

    while (
        remaining.length > 0
    ) {

        const available =
            remaining.filter(
                process =>
                    process.arrival <= time
            );

        if (
            available.length === 0
        ) {

            time =
                Math.min(
                    ...remaining.map(
                        process =>
                            process.arrival
                    )
                );

            continue;
        }


        available.sort(
            (a, b) => {

                if (
                    a.burst !==
                    b.burst
                ) {
                    return (
                        a.burst -
                        b.burst
                    );
                }

                return (
                    a.arrival -
                    b.arrival
                );
            }
        );


        const selected =
            available[0];

        const index =
            remaining.indexOf(
                selected
            );

        remaining.splice(
            index,
            1
        );


        const start = time;

        time += selected.burst;

        const completion = time;

        const turnaround =
            completion -
            selected.arrival;

        const waiting =
            turnaround -
            selected.burst;


        result.push({
            ...selected,
            completion,
            turnaround,
            waiting
        });


        timeline.push({
            pid: selected.pid,
            start,
            end: completion
        });
    }


    return {
        processes: result,
        timeline
    };
}


// ------------------------------------------------------------
// PRIORITY
// Lower number = higher priority
// ------------------------------------------------------------

function priorityScheduling(list) {

    const remaining =
        list.map(
            process => ({
                ...process
            })
        );

    const result = [];
    const timeline = [];

    let time = 0;


    while (
        remaining.length > 0
    ) {

        const available =
            remaining.filter(
                process =>
                    process.arrival <= time
            );


        if (
            available.length === 0
        ) {

            time =
                Math.min(
                    ...remaining.map(
                        process =>
                            process.arrival
                    )
                );

            continue;
        }


        available.sort(
            (a, b) => {

                if (
                    a.priority !==
                    b.priority
                ) {
                    return (
                        a.priority -
                        b.priority
                    );
                }

                return (
                    a.arrival -
                    b.arrival
                );
            }
        );


        const selected =
            available[0];

        const index =
            remaining.indexOf(
                selected
            );

        remaining.splice(
            index,
            1
        );


        const start = time;

        time += selected.burst;

        const completion = time;

        const turnaround =
            completion -
            selected.arrival;

        const waiting =
            turnaround -
            selected.burst;


        result.push({
            ...selected,
            completion,
            turnaround,
            waiting
        });


        timeline.push({
            pid: selected.pid,
            start,
            end: completion
        });
    }


    return {
        processes: result,
        timeline
    };
}


// ------------------------------------------------------------
// ROUND ROBIN
// ------------------------------------------------------------

function roundRobin(
    list,
    quantum
) {

    const sorted =
        [...list].sort(
            (a, b) =>
                a.arrival -
                b.arrival
        );


    const remaining =
        new Map();


    sorted.forEach(process => {

        remaining.set(
            process.pid,
            process.burst
        );

    });


    const completion =
        new Map();

    const queue = [];

    let time = 0;

    let index = 0;

    const timeline = [];


    while (
        index < sorted.length ||
        queue.length > 0
    ) {

        if (
            queue.length === 0 &&
            index < sorted.length &&
            time <
                sorted[index].arrival
        ) {

            time =
                sorted[index].arrival;
        }


        while (
            index < sorted.length &&
            sorted[index].arrival <= time
        ) {

            queue.push(
                sorted[index]
            );

            index++;
        }


        const process =
            queue.shift();


        const remainingTime =
            remaining.get(
                process.pid
            );


        const runTime =
            Math.min(
                quantum,
                remainingTime
            );


        const start = time;

        time += runTime;


        remaining.set(
            process.pid,
            remainingTime -
            runTime
        );


        timeline.push({
            pid: process.pid,
            start,
            end: time
        });


        while (
            index < sorted.length &&
            sorted[index].arrival <= time
        ) {

            queue.push(
                sorted[index]
            );

            index++;
        }


        if (
            remaining.get(
                process.pid
            ) > 0
        ) {

            queue.push(
                process
            );

        } else {

            completion.set(
                process.pid,
                time
            );
        }
    }


    const result =
        sorted.map(
            process => {

                const complete =
                    completion.get(
                        process.pid
                    );

                const turnaround =
                    complete -
                    process.arrival;

                const waiting =
                    turnaround -
                    process.burst;

                return {
                    ...process,
                    completion:
                        complete,
                    turnaround,
                    waiting
                };
            }
        );


    return {
        processes: result,
        timeline
    };
}


// ------------------------------------------------------------
// ALGORITHM RUNNER
// ------------------------------------------------------------

function runAlgorithm(
    name,
    list,
    quantum
) {

    if (name === "fcfs") {
        return fcfs(list);
    }

    if (name === "sjf") {
        return sjf(list);
    }

    if (name === "rr") {
        return roundRobin(
            list,
            quantum
        );
    }

    if (name === "priority") {
        return priorityScheduling(
            list
        );
    }

    return fcfs(list);
}


// ------------------------------------------------------------
// AVERAGE WAITING
// ------------------------------------------------------------

function averageWaiting(result) {

    if (
        result.processes.length === 0
    ) {
        return 0;
    }

    const total =
        result.processes.reduce(
            (sum, process) =>
                sum + process.waiting,
            0
        );

    return (
        total /
        result.processes.length
    );
}


// ------------------------------------------------------------
// RUN SIMULATION
// ------------------------------------------------------------

document
    .getElementById("runBtn")
    .addEventListener(
        "click",
        runSimulation
    );


function runSimulation() {

    if (
        processes.length === 0
    ) {

        alert(
            "Add at least one process."
        );

        return;
    }


    const quantum =
        Math.max(
            1,
            Number(
                quantumInput.value
            )
        );


    const algorithmNames = {

        fcfs:
            "First Come First Serve",

        sjf:
            "Shortest Job First",

        rr:
            "Round Robin",

        priority:
            "Priority Scheduling"

    };


    const selected =
        document.getElementById(
            "algorithm"
        ).value;


    const results = {};


    if (
        selected === "all"
    ) {

        Object.keys(
            algorithmNames
        ).forEach(key => {

            results[key] =
                runAlgorithm(
                    key,
                    processes,
                    quantum
                );

        });

    } else {

        results[selected] =
            runAlgorithm(
                selected,
                processes,
                quantum
            );
    }


    const comparison =
        Object.entries(results)
            .map(
                ([key, result]) => ({

                    key,

                    name:
                        algorithmNames[
                            key
                        ],

                    result,

                    average:
                        averageWaiting(
                            result
                        )

                })
            )
            .sort(
                (a, b) =>
                    a.average -
                    b.average
            );


    const best =
        comparison[0];


    renderResults(
        comparison,
        best
    );


    renderMetrics(
        best.result
    );


    renderGantt(
        best.result.timeline,
        best.name
    );


    renderChart(
        comparison
    );


    document.getElementById(
        "bestAlgorithm"
    ).textContent =
        best.name;


    document.getElementById(
        "bestWaiting"
    ).textContent =
        formatNumber(
            best.average
        );


    document.getElementById(
        "bestDescription"
    ).textContent =
        `${best.name} produced the lowest average waiting time for the current process workload.`;
}


// ------------------------------------------------------------
// FORMAT NUMBER
// ------------------------------------------------------------

function formatNumber(number) {

    return Number(number)
        .toFixed(2)
        .replace(".00", "");
}


// ------------------------------------------------------------
// RESULTS TABLE
// ------------------------------------------------------------

function renderResults(
    comparison,
    best
) {

    resultsBody.innerHTML = "";


    comparison.forEach(item => {

        const row =
            document.createElement(
                "tr"
            );


        if (
            item.key === best.key
        ) {

            row.classList.add(
                "best-row"
            );
        }


        row.innerHTML = `

            <td>
                <strong>
                    ${item.name}
                </strong>
            </td>

            <td>
                ${formatNumber(
                    item.average
                )} ms
            </td>

            <td>

                ${
                    item.key === best.key

                    ? `
                        <span class="badge badge-best">
                            OPTIMAL
                        </span>
                    `

                    : `
                        <span class="badge badge-normal">
                            ANALYZED
                        </span>
                    `
                }

            </td>
        `;


        resultsBody.appendChild(
            row
        );
    });
}


// ------------------------------------------------------------
// METRICS
// ------------------------------------------------------------

function renderMetrics(result) {

    metricsBody.innerHTML = "";


    const sorted =
        [...result.processes]
            .sort(
                (a, b) =>
                    a.pid.localeCompare(
                        b.pid,
                        undefined,
                        {
                            numeric: true
                        }
                    )
            );


    sorted.forEach(process => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${process.pid}
            </td>

            <td>
                ${process.arrival}
            </td>

            <td>
                ${process.burst}
            </td>

            <td>
                ${process.completion}
            </td>

            <td>
                ${process.waiting}
            </td>

            <td>
                ${process.turnaround}
            </td>

        `;


        metricsBody.appendChild(
            row
        );
    });
}


// ------------------------------------------------------------
// GANTT CHART
// ------------------------------------------------------------

function renderGantt(
    timeline,
    algorithmName
) {

    if (
        timeline.length === 0
    ) {

        return;
    }


    document.getElementById(
        "ganttSubtitle"
    ).textContent =
        `${algorithmName} execution sequence • time measured in milliseconds`;


    const track =
        document.createElement(
            "div"
        );

    track.className =
        "gantt-track";


    const totalTime =
        timeline[
            timeline.length - 1
        ].end;


    timeline.forEach(
        (block, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "gantt-block";


            const duration =
                block.end -
                block.start;


            const percentage =
                (
                    duration /
                    totalTime
                ) * 100;


            element.style.width =
                `${percentage}%`;


            element.innerHTML = `

                ${block.pid}

                ${
                    index === 0

                    ? `
                        <span class="gantt-time">
                            ${block.start}
                        </span>
                    `

                    : ""
                }

                <span class="gantt-time">
                    ${block.end}
                </span>

            `;


            track.appendChild(
                element
            );
        }
    );


    ganttChart.innerHTML = "";

    ganttChart.appendChild(
        track
    );
}


// ------------------------------------------------------------
// CHART
// ------------------------------------------------------------

function renderChart(
    comparison
) {

    const canvas =
        document.getElementById(
            "comparisonChart"
        );


    if (
        comparisonChart
    ) {

        comparisonChart.destroy();
    }


    comparisonChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        comparison.map(
                            item =>
                                item.name
                        ),

                    datasets: [

                        {

                            label:
                                "Average Waiting Time",

                            data:
                                comparison.map(
                                    item =>
                                        Number(
                                            item.average
                                        )
                                ),

                            backgroundColor:
                                "#4d7cff",

                            borderWidth:
                                0,

                            borderRadius:
                                2

                        }

                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                color:
                                    "#69727d",

                                font: {
                                    size: 9
                                }

                            },

                            grid: {

                                color:
                                    "#20252b"

                            }

                        },


                        x: {

                            ticks: {

                                color:
                                    "#69727d",

                                font: {
                                    size: 9
                                }

                            },

                            grid: {
                                display:
                                    false
                            }

                        }

                    }
                }
            }
        );
}


// ------------------------------------------------------------
// CLEAR RESULTS
// ------------------------------------------------------------

function clearResults() {

    document.getElementById(
        "bestAlgorithm"
    ).textContent =
        "Awaiting Simulation";


    document.getElementById(
        "bestWaiting"
    ).textContent =
        "—";


    document.getElementById(
        "bestDescription"
    ).textContent =
        "Run the scheduler to compare algorithm performance.";


    resultsBody.innerHTML = `

        <tr>

            <td colspan="3">

                <div class="empty-state">
                    No simulation data
                </div>

            </td>

        </tr>

    `;


    metricsBody.innerHTML = `

        <tr>

            <td colspan="6">

                <div class="empty-state">
                    No metrics available
                </div>

            </td>

        </tr>

    `;


    ganttChart.innerHTML = `

        <div class="gantt-placeholder">

            <span>CPU</span>

            Waiting for execution data

        </div>

    `;


    document.getElementById(
        "ganttSubtitle"
    ).textContent =
        "Execute a simulation to generate the Gantt chart.";


    if (
        comparisonChart
    ) {

        comparisonChart.destroy();

        comparisonChart = null;
    }
}


// ------------------------------------------------------------
// QUANTUM
// ------------------------------------------------------------

quantumInput.addEventListener(
    "input",
    updateSummary
);


// ------------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------------

renderProcesses();