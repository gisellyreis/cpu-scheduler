import React, { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";

import Cell from "./Cell";

import { schedulingAlgorithms } from "../libs/storage";

export default ({ tasks, executedTask, time, columnsNumber, selectedSchedulingAlgorithm }) => {
  const [maxTime, setMaxTime] = useState(columnsNumber);
  const [matrix, setMatrix] = useState(
    Array.from({ length: tasks.length }, () =>
      Array.from({ length: columnsNumber }, () => 0)
    )
  );

  const schedulingAlgorithm =
    schedulingAlgorithms[selectedSchedulingAlgorithm - 1];

  useEffect(() => {
    const draw = () => {
      if (time > columnsNumber) {
        const updatedMatrix = matrix.map((task, _) => {
          task.push(0);
          return task;
        });

        setMatrix(updatedMatrix);
        setMaxTime(time);
      }

      const updatedMatrix = matrix.map((task, index) => {
        if(time > tasks[index].arrivalTime && 
          !(task.filter(x => (x === 1 || x === 3)).length === tasks[index].executionTime)) {
          task[time - 1] = 4
        }

        return task;
      });

      setMatrix(updatedMatrix);

      if (executedTask !== undefined) {
        const updatedMatrix = matrix;
        updatedMatrix[executedTask.id - 1][time - 1] = executedTask.overload
          ? 2
          : schedulingAlgorithm.name === "EDF" && executedTask.deadline < time
          ? 3
          : 1;

        setMatrix(updatedMatrix);
      }
    };

    draw();
  }, [time]);

  return (
    <View style={styles.container}>
      <View>
        {tasks.map((task, row) => (
          <View key={`infoS${row}`} style={styles.row}>
            <View style={styles.row}>
              <Cell text={task.arrivalTime} />
              <Cell text={task.executionTime} />
              <Cell text={task.deadline} />
              <Cell text={task.priority} />
              <Cell text={task.id} />
            </View>
          </View>
        ))}
        <View style={styles.row}>
          <Cell text="TC" />
          <Cell text="TE" />
          <Cell text="D" />
          <Cell text="P" />
          <Cell text="ID" />
        </View>
      </View>
      <View>
        {matrix.map((task, row) => {
          const { deadline } = tasks[row];

          return (
            <View key={`${row}`} style={styles.row}>
              {task.map((cell, column) => (
                <Cell
                  style={[
                    cell === 4 && { backgroundColor: "yellow" },
                    schedulingAlgorithm.name === "EDF" &&
                      column === deadline - 1 && { borderEndColor: "red" },
                    cell === 1 && { backgroundColor: "chartreuse" },
                    cell === 2 && { backgroundColor: "red" },
                    cell === 3 && { backgroundColor: "darkgreen" },
                  ]}
                  key={`${row}${column}`}
                />
              ))}
            </View>
          );
        })}
        <View style={styles.row}>
          {[...Array(Number(maxTime))].map((_, index) => (
            <Cell key={`time${index + 1}`} text={`${index + 1}`} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
});
