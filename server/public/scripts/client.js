$( document ).ready(onReady);

function onReady() {
    $( "#addCategoryBtn" ).on("click", addCategory);
} //end onReady

//initialize globals

//remaining functions listed alphabetically

function addCategory() {
    if ($( "#addCategoryBtn" ).text() === "+") {
        $( "#addCategoryBtn" ).text("-");
        $( "#inputTable" ).append(`
            <tr id="newCategoryRow">
                <td>
                </td>
                <td>
                </td>
                <td style="vertical-align:top;">
                    <label for="categoryNameIn" class="form-inline col-form-label" style="margin-left: 50px;">New Category:</label>
                </td>
                <td style="vertical-align:top;">
                    <div class="form-group">
                        <div class="form-inline">
                            <input type="text" class="form-inline form-control" id="categoryNameIn" placeholder="New Category">
                    </div>
                </td>
            </tr>
        `);
        $( "#colors" ).append(`
            <legend class="mt-4" id="colorRowLegend">Assign Color</legend>
            <table id="colorTable">
                <tr>
                    <fieldset class="form-group" id="categoryColorIn">
                        <td>
                            <div class="form-check" style="color:red;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="red" value="red" checked="">
                                    Red
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:orange;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="orange" value="orange">
                                    Orange
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:gold;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="yellow" value="yellow">
                                    Yellow
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:green;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="green" value="green">
                                    Green
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:blue;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="blue" value="blue">
                                    Blue
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:indigo;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="indigo" value="indigo">
                                    Indigo
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:violet;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="violet" value="violet">
                                    Violet
                                </label>
                            </div>
                        </td>
                    </fieldset>
                </tr>
            </table>
        `);
    } else {
        $( "#addCategoryBtn" ).text("+");
        $( "#newCategoryRow").remove();
        $( "#colorRowLegend").remove();
        $( "#colorTable").remove();
    }
} //end addCategory