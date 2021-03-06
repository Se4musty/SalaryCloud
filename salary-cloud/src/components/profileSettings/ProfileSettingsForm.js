import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import usersApi from '../../api/users-api';

import ProfileSettingsDropDown from './ProfileSettingsDropDown';

class ProfileSettingsForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          loading: false,
          user: props.user,
          anonData: [],
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    componentDidMount = async () => {
        this.setState({ loading: true });

        await usersApi.getAnonUser(this.state.user.anonId).then( response => {
            if (response.status !== 200) {
                console.log(response.message);
            } else {
                this.setState({ loading: false, anonData: response.data.data });
                console.log("Successful retrieval!");
            }
        }).catch(err => console.log(err));
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const key = event.target.id;
        let anonData = {...this.state.anonData};
        if (key === "city" || key === "state") {
            if (anonData["location"]) {
                anonData["location"][key] = event.target.value;
            } else {
                anonData["location"] = { "city": "...", "state": "..." };
                anonData["location"][key] = event.target.value
            }
        } else {
            anonData[key] = event.target.value
        }
        this.setState({anonData});
    }

    handleSubmitClick = async (event) => {
        event.preventDefault();
        const { anonId } = this.state.user;
        const anonData = this.state.anonData;
        this.setState({ loading: true });  
        await usersApi.updateAnonUser(anonId, anonData).then(response => {
            if (response.status === 200) {
                this.setState({ loading: false});
                window.alert("User Updated Successfully!");
            } else {
                console.log("Invalid HTTP response code!");
                console.log(response.status);
            }
        }).catch(error => {
            console.log(error);
            window.alert("User was not Updated successfully!");
        });

    }

    handleDeleteUser = async (event) => {
        event.preventDefault();
        const { user } = this.state;
        // TODO: Fix Issue with loading...
        this.setState({ loading: true });
        await usersApi.deleteUser(user.userId, user.anonId).then((response) => {
            if (response.status === 200) {
                this.setState({ loading: false});
                console.log("User Deleted Successfully!");
                this.props.handleLogOut();
            } else {
                console.log("Invalid HTTP response code!");
                console.log(response.status);
            }
        }).catch(error => {
            console.log(error);
            window.alert("User Was not deleted successfully");
        });
    }

    render() {
        const { anonData } = this.state;

	let position = "...";
        let state = "...";
        let city = "...";
        let salary = "1000";
        let employer = "Enter company name here...";
        let yearsOfExp = "0";

        if (typeof anonData !== 'undefined')
        {
            position = (anonData['positionTitle']) ? anonData['positionTitle'] : position;
            state = (anonData['location']) ? anonData['location']['state'].toString() : state;
            city = (anonData['location']) ? anonData['location']['city'].toString() : city;
            salary = (anonData['salary']) ? anonData['salary'].toString() : salary;
            employer = (anonData['employer']) ? anonData['employer'] : employer;
            yearsOfExp = (anonData['yearsOfExp']) ? anonData['yearsOfExp'].toString() : yearsOfExp;
        } 

        return (
            <div className="ProfileSettingsForm">
                <Form className="mb-5" onSubmit={this.handleSubmitClick}>
                    <ProfileSettingsDropDown current={position} handleInputChange={this.handleInputChange} title="Position Title" options={["Software Engineer", "Software Developer"]}/>
                    <ProfileSettingsDropDown current={state} handleInputChange={this.handleInputChange} title="State" options={["New York", "Georgia", "California"]}/>
                    <ProfileSettingsDropDown current={city} handleInputChange={this.handleInputChange} title="City" options={["New York City", "Buffalo", "Los Angeles", "Atlanta"]}/>

                    <div className="text-left">
                        <Form.Label>Current Salary</Form.Label>
                        <Form.Group controlId="salary">
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    type="number"
                                    value={salary}
                                    onChange={this.handleInputChange}
                                    min="1000"
                                    max="1000000000000"
                                    aria-label="currentSalary"
                                    aria-describedby="current-salary-input"
                                    data-testid="profile-settings-salary-input" 
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text>/yr</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </div>

                    <div className="text-left">
                        <Form.Label>Company</Form.Label>
                        <Form.Group controlId="employer">
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="search"
                                    value={employer} 
                                    onChange={this.handleInputChange}
                                    aria-label="currentCompany"
                                    aria-describedby="current-company-input"
                                    data-testid="profile-settings-company-input" 
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>

                    <div className="text-left">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Group controlId="yearsOfExp">
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    value={yearsOfExp}
                                    onChange={this.handleInputChange}
                                    min="00"
                                    max="100"
                                    aria-label="currentExperienceLevel"
                                    aria-describedby="current-experience-input"
                                    data-testid="profile-settings-yearsofexp-input" 
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text>years</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </div>

                    <div className="mt-1 mb-1">
                    <Button data-testid="profile-settings-submit-button" variant="primary" type="submit" onSubmit={this.handleSubmitClick}>
                        Submit
                    </Button>
                    </div>

                    <div className="mt-1 mb-1">
                    <Button data-testid="profile-settings-delete-button" variant="danger" type="input" onClick={this.handleDeleteUser}>
                        Delete Account
                    </Button>
                    </div>
                </Form>
            </div>
        );
    } 
}

export default ProfileSettingsForm;
