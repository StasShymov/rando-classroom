import {useEffect, useState} from "react";

const Status = Object.freeze({
    READY: 'ready',
    EMPTY: 'empty',
    ALREADY: 'already',
    SELECTED: 'selected',
});

const LOCALSTORAGE_SETTINGS_KEY = 'rand0-classroom-settings:';

export default function ClassRoom() {
    const [numberOfSeatsPerDesk, setNumberOfSeatsPerDesk] = useState(()=>{
        const numberOfSeatsPerDeskLS = localStorage.getItem('numberOfSeatsPerDesk');
        console.log('init numberOfSeatsPerDeskLS: ' + numberOfSeatsPerDeskLS);
        return numberOfSeatsPerDeskLS ? parseInt(numberOfSeatsPerDeskLS) : 2;
    });
    useEffect(() => {
        localStorage.setItem('numberOfSeatsPerDesk', numberOfSeatsPerDesk.toString());
        console.log('set numberOfSeatsPerDeskLS: ' + numberOfSeatsPerDesk);
    }, [numberOfSeatsPerDesk]);

    const [numberOfDeskRows, setNumberOfDeskRows] = useState(()=>{
        const numberOfDeskRowsLS = localStorage.getItem('numberOfDeskRows');
        console.log('init numberOfDeskRowsLS: ' + numberOfDeskRowsLS);
        return numberOfDeskRowsLS ? parseInt(numberOfDeskRowsLS) : 5;
    });
    useEffect(() => {
        localStorage.setItem('numberOfDeskRows', numberOfDeskRows.toString());
        console.log('set numberOfDeskRowsLS: ' + numberOfDeskRows);
    }, [numberOfDeskRows]);

    const [numberOfDeskColumns, setNumberOfDeskColumns] = useState(()=>{
        const numberOfDeskColumnsLS = localStorage.getItem('numberOfDeskColumns');
        console.log('init numberOfDeskColumnsLS: ' + numberOfDeskColumnsLS);
        return numberOfDeskColumnsLS ? parseInt(numberOfDeskColumnsLS) : 3;
    });
    useEffect(() => {
        localStorage.setItem('numberOfDeskColumns', numberOfDeskColumns.toString());
        console.log('set numberOfDeskColumnsLS: ' + numberOfDeskColumns);
    }, [numberOfDeskColumns]);

    // useEffect(() => {
    //     const numberOfSeatsPerDeskLS = JSON.parse(localStorage.getItem());
    //     if (numberOfSeatsPerDeskLS) {
    //         console.log('got numberOfSeatsPerDeskLS: ' + numberOfSeatsPerDeskLS);
    //         setNumberOfSeatsPerDesk(numberOfSeatsPerDeskLS)
    //     }
    // }, []);

    const [settingsVisible, setSettingsVisible] = useState(false);
    const numberOfStudents = numberOfDeskRows * numberOfDeskColumns * numberOfSeatsPerDesk;
    const [students, setStudents] = useState(Array(numberOfStudents).fill(Status.READY));
    const numStudentsLeft = students.filter(element => element === Status.READY).length;
    if (numberOfStudents !== students.length) {
        console.log("Updated and reset to numberOfStudents: " + numberOfStudents);
        setStudents(Array(numberOfStudents).fill(Status.READY))
    }


    function Desk({rowIndex, colIndex}) {
        const seats = [];

        for (let i = 0; i < numberOfSeatsPerDesk; i++) {
            const index = (rowIndex * numberOfDeskColumns + colIndex) * numberOfSeatsPerDesk + i;
            const status = students[index];
            seats.push(
                <img src={`./images/student-${status}.svg`}
                     key={i}
                     alt={status}
                     style={{maxWidth: 100 / numberOfSeatsPerDesk + '%'}}
                     onClick={() => {
                         const studentsNext = students.slice();
                         studentsNext[index] = status === Status.EMPTY ? Status.READY : Status.EMPTY;
                         setStudents(studentsNext);
                     }
                     }
                />
            );
        }
        return <div className="desk" style={{height: 'calc(100%/' + {numberOfDeskRows} + ')'}}>
            {seats}
        </div>
    }

// onClick={() => handleClick(rowIndex, colIndex, i)}
    function goClicked() {
        let nextStudents = students.map((element) => {
            return element === Status.SELECTED ? Status.ALREADY : element
        });
        if (numStudentsLeft === 0) {
            nextStudents = nextStudents.map((element) => {
                return element === Status.ALREADY ? Status.READY : element
            });
        } else {
            while (numStudentsLeft > 0) {
                const index = Math.floor(Math.random() * numberOfStudents);
                if (nextStudents[index] !== Status.ALREADY && nextStudents[index] !== Status.EMPTY) {
                    nextStudents[index] = Status.SELECTED;
                    break;
                }
            }
        }

        setStudents(nextStudents);
    }

    const allDesks = [];

    for (let i = 0; i < numberOfDeskRows; i++) {
        for (let k = 0; k < numberOfDeskColumns; k++) {
            allDesks.push(<Desk key={i * numberOfDeskColumns + k} rowIndex={i} colIndex={k}/>);
        }
    }

    const inlineStyle = {
        gridTemplateColumns: `repeat(${numberOfDeskColumns}, 1fr)`,
        gridTemplateRows: `repeat(${numberOfDeskRows}, 1fr)`,
    };

    return <div className="app-container">
        <div style={{display: "flex"}}>
            <div style={{width: 50 + '%'}}>
                <h2>Rand() for Classroom <button onClick={() => {
                    setSettingsVisible(!settingsVisible);
                }}>Edit</button>
                    <div className="settings" style={{visibility: settingsVisible ? 'visible' : 'collapse'}}>
                        &nbsp;Rows: <input value={numberOfDeskRows} size={2}
                                           onChange={(e) => {
                                               setNumberOfDeskRows(Number(e.currentTarget.value))
                                           }}/>
                        &nbsp;Columns: <input value={numberOfDeskColumns} size={2}
                                              onChange={(e) => {
                                                  setNumberOfDeskColumns(Number(e.currentTarget.value))
                                              }}/>
                        &nbsp;Seats per desk: <input value={numberOfSeatsPerDesk} size={2}
                                                     onChange={(e) => {
                                                         setNumberOfSeatsPerDesk(Number(e.currentTarget.value))
                                                     }}/>
                    </div>
                </h2>
            </div>
            <div className="go-button-container">
                <button className="go-button" onClick={goClicked}>
                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" fill={numStudentsLeft > 0 ? '#4CAF50' : '#DCDF50'}/>
                        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="white"
                              fontFamily="Arial, sans-serif" fontSize={numStudentsLeft > 0 ? '36' : '24'}
                              fontWeight="bold">
                            {numStudentsLeft > 0 ? 'GO' : 'RESET'}
                        </text>
                    </svg>
                </button>
            </div>
        </div>
        <div className="classroom" style={inlineStyle}>
            {allDesks}
        </div>

    </div>

}



