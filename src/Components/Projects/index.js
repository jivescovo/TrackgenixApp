import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProject, getProjects } from 'redux/projects/thunks';
import styles from './projects.module.css';
import { ButtonAdd, Modal, Spinner, Table } from 'Components/Shared';

const Projects = () => {
  const history = useHistory();
  const [projectId, setProjectId] = useState();
  const [showModal, setShowModal] = useState(false);
  const values = ['name', 'clientName', 'description', 'startDate'];
  const headers = ['Name', 'Client Name', 'Description', 'Start Date'];
  const { list: projects, isLoading } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProjects());
  }, []);

  const onDelete = (id, showModal) => {
    setProjectId(id);
    setShowModal(showModal);
  };

  const onRowClick = (id) => {
    history.push(`projects/form/${id}`);
  };

  if (isLoading) {
    return <Spinner isLoading={isLoading} />;
  }
  return (
    <>
      <div className={styles.container}>
        <h1>Projects</h1>
        <Table
          data={projects}
          headers={headers}
          values={values}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
        <Modal
          isOpen={showModal}
          handleClose={setShowModal}
          isActionModal={true}
          action={() => projectId && dispatch(deleteProject(projectId))}
          actionButton="Delete"
        >
          <div>
            <h4>Delete Project</h4>
            <p>Are you sure you want to remove project?</p>
            <p>Changes cannot be undone.</p>
          </div>
        </Modal>
        <div className={styles.buttonMargin}>
          <ButtonAdd
            text="Add Project"
            type="submit"
            variant="main"
            onClick={() => {
              history.push(`projects/form`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Projects;
