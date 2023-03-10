import React from 'react';
import styles from './table.module.css';
import Delete from 'assets/trash.png';

const Table = ({ data, headers, values, onDelete, onRowClick, showDelete }) => {
  const getButtons = (row) => {
    if (showDelete) {
      return (
        <td>
          <button
            className={row.role === 'PM' ? styles.button : styles.noDelete}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(row._id, true);
            }}
          >
            x
          </button>
        </td>
      );
    }
    return (
      <td>
        <button
          className={styles.button}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(row._id, true);
          }}
        >
          x
        </button>
      </td>
    );
  };
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => {
              return <th key={index}>{header}</th>;
            })}
            <th>
              <img src={Delete} />
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr key={row._id}>
                {values.map((value, index) => {
                  return (
                    <td
                      key={index}
                      onClick={() => {
                        onRowClick(row._id);
                      }}
                    >
                      {row[value]}
                    </td>
                  );
                })}
                {getButtons(row)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
