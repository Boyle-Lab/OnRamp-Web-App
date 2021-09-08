import React, { Component } from 'react';
import browser from './browser_config';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TextValidator } from 'react-material-ui-form-validator';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

/*
This code is part of the CGIMP distribution
(https://github.com/Boyle-Lab/CGIMP) and is governed by its license.
Please see the LICENSE file that should have been included as part of this
package. If not, see <https://www.gnu.org/licenses/>.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

CONTACT: Adam Diehl, adadiehl@umich.edu
*/

const styles = theme => ({
    root: {
	width: '100%',
	marginTop: theme.spacing(3),
	overflowX: 'auto',
    },
    table: {
	minWidth: 700,
    },
});


//function OptsTable(props) {
class REOptsTable extends Component {
    constructor(props) {
	super(props);
        this.state = {
	    enzymes: {},
	    offsets: {},
	    errors: {},
	    showEnzymes: false,
	    showOffsets: false,
	    enableSubmit: false,
	    errorsExist: false
	}
    }

    componentDidMount() {
	const enzymes = {};
	const offsets = {};
	const errors = {};
	Object.keys(this.props.data).map((key, index) => {
	    enzymes[key] = this.props.data[key].enzyme;
	    if ('cut_sites' in this.props.data[key] && this.props.data[key].cut_sites.length === 1) {
		offsets[key] = this.props.data[key].cut_sites[0];
	    } else {
		if ('error' in this.props.data[key]) {
                    errors[key] = this.props.data[key].error;
		} else {
		    errors[key] = "Undefined error.";
		}
	    }
	});
	this.setState({
	    enzymes: enzymes,
	    offsets: offsets,
	    errors: errors,
	    showEnzymes: true,
	}, () => {
	    //console.log('enzymes: ', this.state.enzymes);
	    if (Object.keys(this.state.enzymes).length > 0 ) {
		this.setState({ 'enableSubmit': true });
	    }
	    if (Object.keys(this.state.offsets).length > 0 ) {
                this.setState({ 'showOffsets': true });
            }
	    if (Object.keys(this.state.errors).length > 0 ) {
                this.setState({ 'errorsExist': true });
            } else {
		this.setState({ 'errorsExist': false });
	    }
	});
    }

    componentWillUnmount() {
	//this.submitForm.click();
    }
    
    handleChange = (key, dest) => event => {
	// Handle changes to form input fields
	event.preventDefault();
	const newData = this.props.data;
	// Enzyme name is NOT in event.target.value as it should be :-(
	newData[key][dest] = event.target.textContent;
	if (dest === 'enzyme') {
	    this.setState({
		'enableSubmit': false,
		'errorsExist': true
	    });
	    const newEnzymes = this.state.enzymes;
	    newEnzymes[key] = event.target.textContent;	    
	    this.setState({
		'enzymes': newEnzymes,
		'enableSubmit': true
	    },
			  () => {
			      //console.log(this.state.enzymes[key]);
			  });
	}
	
	this.props.updateWrapperState('fastaREData', newData);
    }

    processData = (event) => {
	event.preventDefault();
	const REStr = JSON.stringify(this.state.enzymes);
	//console.log(REStr);
	        axios.post(browser.apiAddr + "/findREOffsets",
			   {
			       serverId: this.props.serverId,
			       fastaREStr: REStr
			   }
                  )
            .then(res => {
                // Display the results and update parent state.
		const data = JSON.parse(res.data.data);
		//console.log("fastaREdata:", data);
		this.props.updateWrapperState('fastaREData', data);
		const offsets = {};
		const errors = {};
		let errorsExist = false;
		Object.keys(data).map( (key, index) => {
		    if (data[key].cut_sites.length == 1) {
			offsets[key] = data[key].cut_sites[0];
		    } else {
			errors[key] = data[key].error;
			errorsExist = true;
		    }
		});
		this.setState({
		    offsets: offsets,
		    errors: errors,
		    showOffsets: true,
		    enableSubmit: false,
		    errorsExist: errorsExist
		});
            })
            .catch(error => {
                console.log(error);
		// Handle the error
            });

	
    }

    render() {
	const { classes } = this.props;
	console.log('Render REOptsTable');
	return (
		<Paper className={classes.root}>
		<ValidatorForm
                    ref="enzymesForm"
                    onSubmit={this.processData}
                    onError={errors => console.log(errors)}
		>
		<Table className={classes.table}>
		<TableHead>
		<TableRow key="head">
		{["Plasmid Sequence File", "Restriction Enzyme", "Offset"].map((val, index) => (
		    index < 2 ?
			<TableCell key={val} align="left">{val}</TableCell>
			:
			<TableCell key={val} align="right">{val}</TableCell>
		))}
	        </TableRow>
	        </TableHead>
		<TableBody>
		{Object.keys(this.props.data).map((key, index) => (
			<TableRow key={index.toString()}>
			<TableCell key="1" align="left">{key}</TableCell>
			<TableCell key="2" align="left">
			{this.state.showEnzymes ?
			 <Autocomplete
			 value={this.state.enzymes[key]}
			 id={"enzyme" + index.toString()}
			 options={enzymeList.map((enzyme) => enzyme)}
			 onChange={this.handleChange(key, 'enzyme')}
			 renderInput={(params) => (
			     <TextField
			         {...params}
			         label="Enter enzyme (leave blank if none used)"
			         margin="normal"
			         fullWidth={true}
			     />
			 )}
			 />
			 :
			 ("")
			}
		        </TableCell>
			<TableCell key="3" align="right">
			{this.state.showOffsets ?
			 (key in this.state.offsets ?
			  (this.state.offsets[key])
			  :
			  (key in this.state.errors && this.state.errors[key] !== "" ?
			   (<span className='poor'>ERROR: {this.state.errors[key]}</span>)
			   :
			   ("")
			  )
			 )
			 :
			 ("")
			}
		        </TableCell>
			</TableRow>
		))}
                </TableBody>
	        </Table>
		<input type="submit" ref={input => this.submitForm = input} value="Find Offsets" disabled={!(this.state.enableSubmit)}/>
		<input type="submit" value="Close Window" onClick={() => this.props.updateParentState('showREOpts', false)} disabled={this.state.errorsExist}/>
		</ValidatorForm>
	        </Paper>
	);
    }
}

REOptsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


const enzymeList = ['AanI', 'AarI', 'AasI', 'AatII', 'AbaSI', 'AbsI', 'Acc16I', 'Acc36I', 'Acc65I', 'AccB1I', 'AccB7I', 'AccBSI', 'AccI', 'AccII', 'AccIII', 'AciI', 'AclI', 'AclWI', 'AcoI', 'AcsI', 'AcuI', 'AcvI', 'AcyI', 'AdeI', 'AfaI', 'AfeI', 'AfiI', 'AflII', 'AflIII', 'AgeI', 'AgsI', 'AhdI', 'AhlI', 'AjiI', 'AjnI', 'AjuI', 'AleI', 'AloI', 'AluBI', 'AluI', 'Alw21I', 'Alw26I', 'Alw44I', 'AlwI', 'AlwNI', 'Ama87I', 'Aor13HI', 'Aor51HI', 'AoxI', 'ApaI', 'ApaLI', 'ApeKI', 'ApoI', 'ArsI', 'AscI', 'AseI', 'AsiGI', 'AsiSI', 'Asp700I', 'Asp718I', 'AspA2I', 'AspLEI', 'AspS9I', 'AsuC2I', 'AsuHPI', 'AsuII', 'AsuNHI', 'AvaI', 'AvaII', 'AvrII', 'AxyI', 'BaeGI', 'BaeI', 'BalI', 'BamHI', 'BanI', 'BanII', 'BarI', 'BauI', 'BbrPI', 'BbsI', 'Bbv12I', 'BbvCI', 'BbvI', 'BccI', 'BceAI', 'BcgI', 'BciT130I', 'BciVI', 'BclI', 'BcnI', 'BcoDI', 'BcuI', 'BfaI', 'BfmI', 'BfoI', 'BfrI', 'BfuAI', 'BfuI', 'BglI', 'BglII', 'BisI', 'BlnI', 'BlpI', 'BlsI', 'BmcAI', 'Bme1390I', 'Bme18I', 'BmeRI', 'BmeT110I', 'BmgBI', 'BmgT120I', 'BmiI', 'BmrFI', 'BmrI', 'BmsI', 'BmtI', 'BmuI', 'BoxI', 'BpiI', 'BplI', 'BpmI', 'Bpu10I', 'Bpu1102I', 'Bpu14I', 'BpuEI', 'BpuMI', 'Bsa29I', 'BsaAI', 'BsaBI', 'BsaHI', 'BsaI', 'BsaJI', 'BsaWI', 'BsaXI', 'Bsc4I', 'Bse118I', 'Bse1I', 'Bse21I', 'Bse3DI', 'Bse8I', 'BseAI', 'BseBI', 'BseCI', 'BseDI', 'BseGI', 'BseJI', 'BseLI', 'BseMI', 'BseMII', 'BseNI', 'BsePI', 'BseRI', 'BseSI', 'BseX3I', 'BseXI', 'BseYI', 'BsgI', 'Bsh1236I', 'Bsh1285I', 'BshFI', 'BshNI', 'BshTI', 'BshVI', 'BsiEI', 'BsiHKAI', 'BsiHKCI', 'BsiSI', 'BsiWI', 'BslFI', 'BslI', 'BsmAI', 'BsmBI', 'BsmFI', 'BsmI', 'BsnI', 'Bso31I', 'BsoBI', 'Bsp119I', 'Bsp120I', 'Bsp1286I', 'Bsp13I', 'Bsp1407I', 'Bsp143I', 'Bsp1720I', 'Bsp19I', 'Bsp68I', 'BspACI', 'BspANI', 'BspCNI', 'BspDI', 'BspEI', 'BspFNI', 'BspHI', 'BspLI', 'BspMAI', 'BspMI', 'BspOI', 'BspPI', 'BspQI', 'BspT104I', 'BspT107I', 'BspTI', 'BspTNI', 'BsrBI', 'BsrDI', 'BsrFI', 'BsrGI', 'BsrI', 'BssAI', 'BssECI', 'BssHII', 'BssMI', 'BssNAI', 'BssNI', 'BssSI', 'BssT1I', 'Bst1107I', 'Bst2BI', 'Bst2UI', 'Bst4CI', 'Bst6I', 'BstACI', 'BstAFI', 'BstAPI', 'BstAUI', 'BstBAI', 'BstBI', 'BstC8I', 'BstDEI', 'BstDSI', 'BstEII', 'BstENI', 'BstF5I', 'BstFNI', 'BstH2I', 'BstHHI', 'BstKTI', 'BstMAI', 'BstMBI', 'BstMCI', 'BstMWI', 'BstNI', 'BstNSI', 'BstPAI', 'BstPI', 'BstSCI', 'BstSFI', 'BstSLI', 'BstSNI', 'BstUI', 'BstV1I', 'BstV2I', 'BstX2I', 'BstXI', 'BstYI', 'BstZ17I', 'BstZI', 'Bsu15I', 'Bsu36I', 'BsuI', 'BsuRI', 'BsuTUI', 'BtgI', 'BtgZI', 'BtrI', 'BtsCI', 'BtsI', 'BtsIMutI', 'BtuMI', 'BveI', 'Cac8I', 'CaiI', 'CciI', 'CciNI', 'CfoI', 'Cfr10I', 'Cfr13I', 'Cfr42I', 'Cfr9I', 'ClaI', 'CpoI', 'CseI', 'CsiI', 'Csp6I', 'CspAI', 'CspCI', 'CspI', 'CviAII', 'CviJI', 'CviKI_1', 'CviQI', 'DdeI', 'DinI', 'DpnI', 'DpnII', 'DraI', 'DraIII', 'DrdI', 'DriI', 'DseDI', 'EaeI', 'EagI', 'Eam1104I', 'Eam1105I', 'EarI', 'EciI', 'Ecl136II', 'EclXI', 'Eco105I', 'Eco130I', 'Eco147I', 'Eco24I', 'Eco31I', 'Eco32I', 'Eco47I', 'Eco47III', 'Eco52I', 'Eco53kI', 'Eco57I', 'Eco72I', 'Eco81I', 'Eco88I', 'Eco91I', 'EcoICRI', 'EcoNI', 'EcoO109I', 'EcoO65I', 'EcoRI', 'EcoRII', 'EcoRV', 'EcoT14I', 'EcoT22I', 'EcoT38I', 'EgeI', 'EheI', 'ErhI', 'Esp3I', 'FaeI', 'FaiI', 'FalI', 'FaqI', 'FatI', 'FauI', 'FauNDI', 'FbaI', 'FblI', 'Fnu4HI', 'FokI', 'FriOI', 'FseI', 'Fsp4HI', 'FspAI', 'FspBI', 'FspEI', 'FspI', 'GlaI', 'GluI', 'GsaI', 'GsuI', 'HaeII', 'HaeIII', 'HapII', 'HgaI', 'HhaI', 'Hin1I', 'Hin1II', 'Hin6I', 'HinP1I', 'HincII', 'HindII', 'HindIII', 'HinfI', 'HpaI', 'HpaII', 'HphI', 'Hpy166II', 'Hpy188I', 'Hpy188III', 'Hpy8I', 'Hpy99I', 'HpyAV', 'HpyCH4III', 'HpyCH4IV', 'HpyCH4V', 'HpyF10VI', 'HpyF3I', 'HpySE526I', 'Hsp92I', 'Hsp92II', 'HspAI', 'KasI', 'KflI', 'Kpn2I', 'KpnI', 'KroI', 'Ksp22I', 'KspAI', 'KspI', 'Kzo9I', 'LguI', 'LmnI', 'LpnPI', 'Lsp1109I', 'LweI', 'MabI', 'MaeI', 'MaeII', 'MaeIII', 'MalI', 'MauBI', 'MbiI', 'MboI', 'MboII', 'MfeI', 'MflI', 'MhlI', 'MlsI', 'MluCI', 'MluI', 'MluNI', 'Mly113I', 'MlyI', 'MmeI', 'MnlI', 'Mox20I', 'Mph1103I', 'MreI', 'MroI', 'MroNI', 'MroXI', 'MscI', 'MseI', 'MslI', 'Msp20I', 'MspA1I', 'MspCI', 'MspI', 'MspJI', 'MspR9I', 'MssI', 'MteI', 'MunI', 'Mva1269I', 'MvaI', 'MvnI', 'MwoI', 'NaeI', 'NarI', 'NciI', 'NcoI', 'NdeI', 'NdeII', 'NgoMIV', 'NheI', 'NlaIII', 'NlaIV', 'NmeAIII', 'NmuCI', 'NotI', 'NruI', 'NsbI', 'NsiI', 'NspI', 'NspV', 'OliI', 'PacI', 'PaeI', 'PaeR7I', 'PagI', 'PalAI', 'PasI', 'PauI', 'PceI', 'PciI', 'PciSI', 'PcsI', 'PctI', 'PdiI', 'PdmI', 'PfeI', 'Pfl23II', 'PflFI', 'PflMI', 'PfoI', 'PinAI', 'PkrI', 'Ple19I', 'PleI', 'PluTI', 'PmaCI', 'PmeI', 'PmlI', 'PpsI', 'Ppu21I', 'PpuMI', 'PscI', 'PshAI', 'PshBI', 'PsiI', 'Psp124BI', 'Psp1406I', 'Psp5II', 'Psp6I', 'PspCI', 'PspEI', 'PspFI', 'PspGI', 'PspLI', 'PspN4I', 'PspOMI', 'PspPI', 'PspPPI', 'PspXI', 'PsrI', 'PstI', 'PstNI', 'PsuI', 'PsyI', 'PteI', 'PvuI', 'PvuII', 'RgaI', 'RigI', 'RruI', 'RsaI', 'RsaNI', 'RseI', 'Rsr2I', 'RsrII', 'SacI', 'SacII', 'SalI', 'SapI', 'SaqAI', 'SatI', 'Sau3AI', 'Sau96I', 'SbfI', 'ScaI', 'SchI', 'ScrFI', 'SdaI', 'SduI', 'SetI', 'SexAI', 'SfaAI', 'SfaNI', 'SfcI', 'SfiI', 'SfoI', 'Sfr274I', 'Sfr303I', 'SfuI', 'SgeI', 'SgfI', 'SgrAI', 'SgrBI', 'SgrDI', 'SgsI', 'SinI', 'SlaI', 'SmaI', 'SmiI', 'SmiMI', 'SmlI', 'SmoI', 'SnaBI', 'SpeI', 'SphI', 'SrfI', 'Sse8387I', 'Sse9I', 'SseBI', 'SsiI', 'SspDI', 'SspI', 'SspMI', 'SstI', 'StuI', 'StyD4I', 'StyI', 'SwaI', 'TaaI', 'TaiI', 'TaqI', 'TaqII', 'TasI', 'TatI', 'TauI', 'TfiI', 'Tru1I', 'Tru9I', 'TscAI', 'TseFI', 'TseI', 'Tsp45I', 'TspDTI', 'TspGWI', 'TspMI', 'TspRI', 'Tth111I', 'Van91I', 'Vha464I', 'VneI', 'VpaK11BI', 'VspI', 'XagI', 'XapI', 'XbaI', 'XceI', 'XcmI', 'XhoI', 'XmaI', 'XmaJI', 'XmiI', 'XmnI', 'XspI', 'ZraI', 'ZrmI', 'Zsp2I'];

export default withStyles(styles)(REOptsTable);
