<?php
// Set headers for Cross-Origin Resource Sharing (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Credentials: true");

include 'DBConnect.php';
$objDb = new DBConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case "POST":
        $addDoctors = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO doctors(FirstName, MiddleName, LastName, Sex, LicensingNumber, Specialty, Position, HomeAddress, ContactNumber, EmergencyNumber, UserID, EmailAddress) 
        VALUES(:fName, :mName, :lName, :Sex, :licNumber, :Specialty, :Position, :HomeAdd, :ContactNumber, :EmerNumber, :UserID, :EmailAdd)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':fName', $addDoctors->fName);
        $stmt->bindParam(':mName', $addDoctors->mName);
        $stmt->bindParam(':lName', $addDoctors->lName);
        $stmt->bindParam(':Sex', $addDoctors->sex);
        $stmt->bindParam(':licNumber', $addDoctors->licNumber);
        $stmt->bindParam(':Specialty', $addDoctors->specialty);
        $stmt->bindParam(':Position', $addDoctors->position);
        $stmt->bindParam(':HomeAdd', $addDoctors->homeAdd);
        $stmt->bindParam(':ContactNumber', $addDoctors->contactNum);
        $stmt->bindParam(':EmerNumber', $addDoctors->ecNumber);
        $stmt->bindParam(':UserID', $addDoctors->uID);
        $stmt->bindParam(':EmailAdd', $addDoctors->emailAdd);
        if($stmt->execute()){
            $response = ['status' => 1, 'message' => 'Doctor created successfully'];
        } else{
            $response = ['status' => 0, 'message' => 'Failed to create Doctor'];
        }
        echo json_encode($response);
        break;
    case "GET":
        $sql = "SELECT * FROM doctors";
        if (isset($_GET['id']) /*&& is_numeric($_GET['id'])*/) {
            $sql .= " WHERE UserID = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $_GET['id']);
            $stmt->execute();
            $doctor = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $doctor = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($doctor);
        break;
    case "DELETE":
        $sql = "DELETE FROM doctors WHERE UserID = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $_GET['id']);
        if($stmt->execute()){
            $response = ['status' => 1, 'message' => 'Doctor deleted successfully'];
        } else{
            $response = ['status' => 0, 'message' => 'Failed to delete Doctor'];
        }
        echo json_encode($response);
        break;
    case "PUT":
        $editDoctor = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE doctors SET MiddleName = :mName, HomeAddress = :homeAdd, ContactNumber = :cNum, EmergencyNumber = :ecNum WHERE UserID = :userID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':mName', $editDoctor->MiddleName);
        $stmt->bindParam(':homeAdd', $editDoctor->HomeAddress);
        $stmt->bindParam(':cNum', $editDoctor->ContactNumber);
        $stmt->bindParam(':ecNum', $editDoctor->EmergencyNumber);
        $stmt->bindParam(':userID', $editDoctor->UserID);
        if($stmt->execute()){
            $response = ['status' => 1, 'message' => 'Doctor updated successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update Doctor Data'];
        }
        echo json_encode($response);
        break;
}
?>
