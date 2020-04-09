import React from "react";
import {
  Table,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import swal from 'sweetalert';

var firebase = require("firebase");
const config = {
  apiKey: "AIzaSyD46zJ3FD4-SUXkc52ksnAuLTnzdFvoKzQ",
  authDomain: "doterb-test.firebaseapp.com",
  databaseURL: "https://doterb-test.firebaseio.com",
  projectId: "doterb-test",
  storageBucket: "doterb-test.appspot.com",
  messagingSenderId: "811712177593",
  appId: "1:811712177593:web:9259d2c8462de85e834268",
};
firebase.initializeApp(config);

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fields: {},
      errors: {},
      loader: true,
      edit: false,
      add: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  notificationAlert = React.createRef();

  notify(place, color) {
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>Selamat Data Berhasil {this.state.add ? "ditambahkan" : "diubah"} .</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-check-2",
      autoDismiss: 7,
    };
    this.notificationAlert.current.notificationAlert(options);
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Nama Karyawan tidak boleh kosong";
    }

    //age
    if (!fields["age"]) {
      formIsValid = false;
      errors["age"] = "Umur tidak boleh kosong";
    }

    if (parseInt(fields["age"]) > 100) {
      formIsValid = false;
      errors["age"] = "Umur tidak boleh lebih dari 100";
    }

    if (parseInt(fields["age"]) < 17) {
      formIsValid = false;
      errors["age"] = "Umur tidak boleh kurang dari 17";
    }

    //salary
    if (!fields["salary"]) {
      formIsValid = false;
      errors["salary"] = "Gaji tidak boleh kosong";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  handleSubmit(event) {
    event.preventDefault();

    if (this.state.add) {
      if (this.handleValidation()) {
        firebase.database().ref("karyawan").push({
          name: this.state.fields.name,
          age: this.state.fields.age,
          salary: this.state.fields.salary,
        });
        this._getData();
        this.notify("tr", 1);
        this.setState({
          fields: {},
          add: false,
        });
      }
    }else{
      if (this.handleValidation()) {
        firebase.database()
        .ref("karyawan")
        .child(this.state.fields.id)
        .set({
          name: this.state.fields.name,
          age: this.state.fields.age,
          salary: this.state.fields.salary,
        });
        this._getData();
        this.notify("tr", 1);
        this.setState({
          fields: {},
          edit: false,
        });
      }
    }

  }
  _getData() {
    firebase
      .database()
      .ref("karyawan")
      .once("value")
      .then((snapShot) => {
        var datas = [];
        snapShot.forEach((item) => {
          datas.push({
            id: item.key,
            name: item.val().name,
            age: item.val().age,
            salary: item.val().salary,
          });
          this.setState({
            data: datas,
            loader: false,
          });
        });
      });
  }
  componentDidMount() {
    this._getData();
  }
  FormatNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log(parts.join("."));

    return parts.join(".");
  }
  _ResetFields() {
    this.setState({
      fields: {},
      add: false,
      edit: false,
    });
  }
  handleFocus(type) {
    var sett = this.state.errors;
    sett[type] = undefined;
    this.setState({
      errors: sett,
    });
  }
  _delete(id){
    swal({
      title: "Apakah anda yakin ?",
      text: "Data yang sudah dihapus tidak dapat kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        firebase
        .database()
        .ref("karyawan")
        .child(id)
        .remove();
        this._getData()
        swal("Data berhasil dihapus !", {
          icon: "success",
        });
      }
    });
  }
  _edit(item){
    let fields = [];
    fields["id"] = item.id;
    fields["name"] = item.name;
    fields["age"] = item.age;
    fields["salary"] = item.salary;
    this.setState({ 
      fields:fields,
      edit:true,
    });
  }
  render() {
    if (this.state.add || this.state.edit) {
      return (
        <>
          <div className="content">
            <NotificationAlert ref={this.notificationAlert} />
            <Row>
              <Col md="12">
                <Card className="card-user">
                  <CardHeader>
                    <CardTitle tag="h5">{this.state.edit ? 'Edit' : 'Tambah'} Karyawan</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Nama Karyawan</label>
                            <Input
                              defaultValue={this.state.fields["name"]}
                              placeholder="Masukan Nama Karyawan"
                              onFocus={() => {
                                this.handleFocus("salary");
                              }}
                              style={
                                this.state.errors["name"]
                                  ? { borderColor: "red" }
                                  : {}
                              }
                              onChange={(e) => {
                                this.handleChange("name", e);
                              }}
                              type="text"
                            />
                            {this.state.errors["name"] ? (
                              <span style={{ color: "red", marginLeft: 2 }}>
                                {this.state.errors["name"]}
                              </span>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Umur</label>
                            <Input
                              defaultValue={this.state.fields["age"]}
                              placeholder="Masukan Umur"
                              onFocus={() => {
                                this.handleFocus("age");
                              }}
                              style={
                                this.state.errors["age"]
                                  ? { borderColor: "red" }
                                  : {}
                              }
                              onChange={(e) => {
                                this.handleChange("age", e);
                              }}
                              type="number"
                            />
                            {this.state.errors["age"] ? (
                              <span style={{ color: "red", marginLeft: 2 }}>
                                {this.state.errors["age"]}
                              </span>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Gaji</label>
                            <Input
                              defaultValue={this.state.fields["salary"]}
                              placeholder="Masukan Gaji"
                              onFocus={() => {
                                this.handleFocus("salary");
                              }}
                              style={
                                this.state.errors["salary"]
                                  ? { borderColor: "red" }
                                  : {}
                              }
                              onChange={(e) => {
                                this.handleChange("salary", e);
                              }}
                              type="number"
                            />
                            {this.state.errors["salary"] ? (
                              <span style={{ color: "red", marginLeft: 2 }}>
                                {this.state.errors["salary"]}
                              </span>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <div style={{ marginLeft: 15 }}>
                          <Button
                            className="btn-round"
                            color="primary"
                            type="submit"
                          >
                            {this.state.edit ? 'Edit' : 'Tambah'} Karyawan
                          </Button>
                          <Button
                            className="btn-round"
                            color="warning"
                            onClick={() => {
                              this._ResetFields();
                            }}
                          >
                            Batal
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
    return (
      <>
        <div className="content">
          <NotificationAlert ref={this.notificationAlert} />
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Data Karyawan</CardTitle>
                  <button
                    onClick={() => {
                      this.setState({ add: true });
                    }}
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 20,
                    }}
                    type="submit"
                    class="btn-round btn btn-primary"
                  >
                    Tambah Karyawan
                  </button>
                </CardHeader>
                <CardBody>
                  {this.state.loader ? (
                    <img style={{
                        display: "block",
                        margin: "auto",
                      }}
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                    />
                  ) : (
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th width="12%">Aksi</th>
                          <th width="30%">Nama</th>
                          <th width="10%">Umur</th>
                          <th className="text-right">Gaji</th>
                          <th width="1%"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                <Row>
                                  <Button
                                    className="btn btn-sm"
                                    style={{ marginLeft: 10 }}
                                    color="primary"
                                    onClick={() => {
                                      this._edit(item);
                                    }}
                                  >
                                    <i class="nc-icon nc-ruler-pencil"></i>
                                  </Button>
                                  <Button
                                    className="btn btn-sm"
                                    style={{ marginLeft: 10 }}
                                    color="danger"
                                    onClick={() => {
                                      this._delete(item.id);
                                    }}
                                  >
                                    <i class="nc-icon nc-simple-remove"></i>
                                  </Button>
                                </Row>
                              </td>
                              <td>{item.name}</td>
                              <td>{item.age}</td>
                              <td className="text-right">
                                Rp {this.FormatNumber(item.salary)}
                              </td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Tables;
