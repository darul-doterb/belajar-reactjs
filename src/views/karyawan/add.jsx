/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        
    }
    handleChange_Name(event) {
        this.setState({name: event.target.value});
    }
    handleChange_Age(event) {
        this.setState({age: event.target.value});
    }
    handleChange_Salary(event) {
        this.setState({salary: event.target.value});
    }
    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.name);
        event.preventDefault();
      }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card className="card-user">
                    <CardHeader>
                    <CardTitle tag="h5">Tambah Karyawan</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                <label>Nama Karyawan</label>
                                <Input
                                    defaultValue={this.state.name}
                                    placeholder="Masukan Nama Karyawan"
                                    onChange={this.handleChange_Name}
                                    type="text"
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                <label>Umur</label>
                                <Input
                                    defaultValue={this.state.age}
                                    placeholder="Masukan Umur"
                                    onChange={this.handleChange_Age}
                                    type="text"
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                <label>Gaji</label>
                                <Input
                                    defaultValue={this.state.salary}
                                    placeholder="Masukan Gaji"
                                    onChange={this.handleChange_Salary}
                                    type="number"
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                        <div style={{marginLeft:15}}>
                            <Button
                            className="btn-round"
                            color="primary"
                            type="submit"
                            >
                            Tambah Karyawan
                            </Button>
                        </div>
                        </Row>
                    </Form>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default User;
