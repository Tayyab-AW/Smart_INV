function parseInverterResponse(command, response) {
    const cleanedResponse = response.replace(/[^a-zA-Z0-9 . :]/g, ' ');
    const postResponse = cleanedResponse.replace(/[^a-zA-Z]/g, '');
  
    if (command === 'QID') {
      const fields = cleanedResponse.split(' ');
      return {
        serialNumber: fields[0],
      };
    } else if (command === 'QSID') {
      const fields = cleanedResponse.split(' ');
      return {
        serialNumber: fields[0],
      };
    } else if (command === 'QVFW') {
      const cleanedResponse1 = cleanedResponse.replace(/[^0-9 .]/g, '');
      const fields = cleanedResponse1.split('.');
      return {
        mainCPUFirmware: fields[0],
        version: fields[1],
      };
    } else if (command === 'QVFW2') {
      const cleanedResponse1 = cleanedResponse.replace(/[^0-9 .]/g, '');
      const cleanedResponse2 = cleanedResponse1.substring(1);
      const fields = cleanedResponse2.split('.');
      return {
        mainCPUFirmware: fields[0],
        version: fields[1],
      };
    } else if (command === 'QPIRI') {
      const fields = cleanedResponse.split(' ');
      return {
        gridRatingVoltage: fields[0],
        gridRatingCurrent: fields[1],
        AcOutputRatingVoltage: fields[2],
        AcOutputRatingFrequency: fields[3],
        AcOutputRatingCurrent: fields[4],
        AcOutputRatingApparentPower: fields[5],
        AcOutputRatingAcitvePower: fields[6],
        batteryRatingVoltage: fields[7],
        batteryRechargeVoltage: fields[8],
        batteryUnderVoltage: fields[9],
        batteryBulkVoltage: fields[10],
        batteryFloatVoltage: fields[11],
        batteryType: fields[12],
        maxAcChargingCurrent: fields[13],
        currentMaxChargingCurrent: fields[14],
        inputVoltageRange: fields[15],
        outputSourcePriority: fields[16],
        chargeSourcePriority: fields[17],
        parallelMaxNumber: fields[18],
        machineType: fields[19],
        toplogy: fields[20],
        outputMode: fields[21],
        batteryReDischargeVoltage: fields[22],
        pvOkCondtionForParallel: fields[23],
        pvPowerBalance: fields[24],
        maxChargingTimeAtCvStage: fields[25],
      };
    } else if (command === 'QFLAG') {
      const enabledFlags = [];
      const disabledFlags = [];
      let currentCategory = 'E';
  
      for (const char of cleanedResponse) {
        if (char === 'E' || char === 'D') {
          currentCategory = char;
        } else {
          if (currentCategory === 'E') {
            enabledFlags.push(char);
          } else if (currentCategory === 'D') {
            disabledFlags.push(char);
          }
        }
      }
  
      return {
        enabledFlags,
        disabledFlags,
      };
    } else if (command === 'QPIGS') {
      const fields = cleanedResponse.split(' ');
      return {
        gridVoltage: fields[0],
        gridFrequency: fields[1],
        outputVoltage: fields[2],
        outputFrequency: fields[3],
        outputPowerApparent: fields[4],
        outputPowerActive: fields[5],
        outputLoadPercent: fields[6],
        busVoltage: fields[7],
        batteryVoltage: fields[8],
        batteryChargingCurrent: fields[9],
        batteryCapacity: fields[10],
        inverterHeatSinkTemperature: fields[11],
        pvInputCurrentForBattery: fields[12],
        pvInputVoltage: fields[13],
        batteryVoltageSCC: fields[14],
        batteryDischargeCurrent: fields[15],
        InverterStatus: fields[16],
        BatteryVoltageOffsetForFansOn: fields[17],
        EEPROMVersion: fields[18],
        PVChargingPower: fields[19],
        InverterStatus: fields[20],
      };
    } else if (command === 'QPGSn') {
      const fields = cleanedResponse.split(' ');
      return {
        deviceMode: fields[0],
      };
    } else if (command === 'QMOD') {
      const fields = cleanedResponse.split(' ');
      return {
        inverterMode: fields[0],
      };
    } else if (command === 'QPIWS') {
      const fields = cleanedResponse.split('');
      return {
        inverterFault: fields[0],
        busOver: fields[1],
        busUnder: fields[2],
        busSoftFail: fields[3],
        lineFail: fields[4],
        opvShort: fields[5],
        inverterVoltageLow: fields[6],
        inverterVoltageHigh: fields[7],
        overTemperature: fields[8],
        fanLocked: fields[9],
        batteryVoltageTooHigh: fields[10],
        batteryLowAlarm: fields[11],
        overCharge: fields[12],
        batteryUnderShutdown: fields[13],
        batteryDerating: fields[14],
        overLoad: fields[15],
        eepromFault: fields[16],
        inverterOverCurrent: fields[17],
        inverterSoftFail: fields[18],
        selfTestFail: fields[19],
        opDcVoltageOver: fields[20],
        batOper: fields[21],
        currentSensorFail: fields[22],
        batteryShort: fields[23],
        powerLimit: fields[24],
        pvVoltageHigh: fields[25],
        mpptOverloadFault: fields[26],
        mpptOverloadWarning: fields[27],
        batteryTooLowToCharge: fields[28],
      };
    } else if (command === 'QDI') {
      const fields = cleanedResponse.split(' ');
      return {
        acOutputVoltage: fields[0],
        acOuputFrequency: fields[1],
        maxAcChargingCurrent: fields[2],
        batteryUnderVoltage: fields[3],
        chargingFloatVoltage: fields[4],
        chargingBulkVoltage: fields[5],
        batteryDefaultReChargeVoltage: fields[6],
        maxChargingCurrent: fields[7],
        acInputVoltageRange: fields[8],
        outputSourcePriority: fields[9],
        chargeSourcePriority: fields[10],
        batteryType: fields[11],
        enableDisableSilenceBuzzerOrOpenBuzzer: fields[12],
        enableDisablePowerSaving: fields[13],
        enableDisableOverloadRestart: fields[14],
        enableDisableOverTemperatureRestart: fields[15],
        enableDisableLcdBacklightOn: fields[16],
        enableDisableAlarmOnWhenPrimarySourceInterrput: fields[17],
        enableDisableFaultCodeRecord: fields[18],
        overloadBypass: fields[19],
        enableDisableLcdDisplayEscapeToDefaultPageAfter1MinTimeout: fields[20],
        outputMode: fields[21],
        batteryReDischargeVoltage: fields[22],
        pvOkConditionForParallel: fields[23],
        pvPowerBalance: fields[24],
        maxChargingTimeAtCvStage: fields[25],
      };
    } else if (command === 'QMCHGCR') {
      return { response: cleanedResponse };
    } else if (command === 'QMUCHGCR') {
      return { response: cleanedResponse };
    } else if (command === 'QOPM') {
      const fields = cleanedResponse.split(' ');
      return {
        outputMode: fields[0],
      };
    } else if (command === 'QMN') {
      const cleanedResponse1 = cleanedResponse.replace(/[^a-zA-Z0-9 . -]/g, '');
      const fields = cleanedResponse1;
      return {
        modelName: fields,
      };
    } else if (command === 'QGMN') {
      const fields = cleanedResponse.split(' ');
      return {
        modelNameNumber: fields[0],
      };
    } else if (command === 'QBEQI') {
      const fields = cleanedResponse.split(' ');
      return {
        enableOrDisableEqualization: fields[0],
        eqalizationTime: fields[1],
        eqalizationPeriod: fields[2],
        equalizationMaxCurrent: fields[3],
        reserved1: fields[4],
        eqalizationVoltage: fields[5],
        reserved2: fields[6],
        eqalizationOverTime: fields[7],
        equalizationActivePower: fields[8],
        reserverd3: fields[9],
      };
    } else if (command === 'PF') {
      const fields = cleanedResponse;
      return {
        response: fields,
      };
    }
    return { response: postResponse }; // Fallback to return raw response if command is not specifically handled
  }
  
  module.exports = parseInverterResponse;
  